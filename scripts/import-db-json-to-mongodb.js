const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { MongoClient } = require('mongodb');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'src', 'data', 'db.json');
const ENV_PATH = path.join(ROOT, '.env.atlas.local');
const DATABASE_NAME = 'fashion_store';
const GROUPS = [
  'products',
  'categories',
  'collections',
  'orders',
  'customers',
  'users',
  'settings',
];
const ARRAY_GROUPS = GROUPS.filter((group) => group !== 'settings');
const CONFIRMATION = 'IMPORT TO fashion_store';

class SafeImportError extends Error {}

function readSource() {
  let source;
  try {
    source = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
  } catch {
    throw new SafeImportError('Could not read or parse src/data/db.json.');
  }

  const actualGroups = Object.keys(source).sort();
  const expectedGroups = [...GROUPS].sort();
  if (
    actualGroups.length !== expectedGroups.length ||
    actualGroups.some((group, index) => group !== expectedGroups[index])
  ) {
    throw new SafeImportError('The source JSON groups differ from the expected set; import stopped.');
  }

  for (const group of ARRAY_GROUPS) {
    if (!Array.isArray(source[group])) {
      throw new SafeImportError(`The ${group} group is not an array; import stopped.`);
    }

    const ids = new Set();
    for (const record of source[group]) {
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new SafeImportError(`The ${group} group contains an invalid record; import stopped.`);
      }
      if (typeof record.id !== 'string' || record.id.length === 0) {
        throw new SafeImportError(`A ${group} record has no string ID; import stopped.`);
      }
      if (record._id !== undefined && record._id !== record.id) {
        throw new SafeImportError(`A ${group} record has conflicting IDs; import stopped.`);
      }
      if (ids.has(record.id)) {
        throw new SafeImportError(`The ${group} group contains duplicate IDs; import stopped.`);
      }
      ids.add(record.id);
    }
  }

  if (!source.settings || typeof source.settings !== 'object' || Array.isArray(source.settings)) {
    throw new SafeImportError('The settings group is not an object; import stopped.');
  }

  if (source.settings._id !== undefined && typeof source.settings._id !== 'string') {
    throw new SafeImportError('The settings document has an invalid ID; import stopped.');
  }

  return source;
}

function getDocuments(source, group) {
  if (group === 'settings') {
    return [{ ...source.settings, _id: source.settings._id || 'store-settings' }];
  }

  return source[group].map((record) => ({ ...record, _id: record.id }));
}

function readMongoUri() {
  let envFile;
  try {
    envFile = fs.readFileSync(ENV_PATH, 'utf8');
  } catch {
    throw new SafeImportError('Create .env.atlas.local with MONGODB_URI before using Atlas commands.');
  }

  const line = envFile.split(/\r?\n/).find((entry) => /^\s*MONGODB_URI\s*=/.test(entry));
  if (!line) {
    throw new SafeImportError('.env.atlas.local must contain MONGODB_URI.');
  }

  let uri = line.replace(/^\s*MONGODB_URI\s*=\s*/, '').trim();
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1);
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new SafeImportError('MONGODB_URI must be a MongoDB connection string.');
  }

  let parsedUri;
  try {
    parsedUri = new URL(uri);
  } catch {
    throw new SafeImportError('MONGODB_URI is not a valid connection string.');
  }

  const uriDatabase = decodeURIComponent(parsedUri.pathname.replace(/^\/+/, ''));
  if (uriDatabase && uriDatabase !== DATABASE_NAME) {
    throw new SafeImportError(`Set the database in MONGODB_URI to ${DATABASE_NAME}.`);
  }

  return uri;
}

async function connectToDatabase() {
  const client = new MongoClient(readMongoUri(), {
    appName: 'fashionstore-one-time-json-import',
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  return { client, database: client.db(DATABASE_NAME) };
}

async function getTargetCounts(database, session) {
  const counts = {};
  for (const group of GROUPS) {
    counts[group] = await database.collection(group).countDocuments(
      {},
      session ? { session } : {}
    );
  }
  return counts;
}

function reportSourceCounts(source) {
  stdout.write('Source records (counts only):\n');
  for (const group of GROUPS) {
    const count = group === 'settings' ? 1 : source[group].length;
    stdout.write(`  ${group}: ${count}\n`);
  }
}

function findNonEmptyTargets(counts) {
  return GROUPS.filter((group) => counts[group] > 0);
}

async function checkAtlas() {
  const { client, database } = await connectToDatabase();
  try {
    const counts = await getTargetCounts(database);
    const nonEmpty = findNonEmptyTargets(counts);
    if (nonEmpty.length > 0) {
      stdout.write('Import stopped. These target collections already contain documents:\n');
      for (const group of nonEmpty) {
        stdout.write(`  ${group}: ${counts[group]}\n`);
      }
      return 1;
    }

    stdout.write(`Read-only check passed: all target collections in ${DATABASE_NAME} are empty.\n`);
    return 0;
  } finally {
    await client.close();
  }
}

async function requestImportConfirmation() {
  if (process.argv.includes("--yes")) return; if (!stdin.isTTY) {
    throw new SafeImportError('Import requires an interactive confirmation prompt.');
  }

  const terminal = readline.createInterface({ input: stdin, output: stdout });
  try {
    const answer = await terminal.question(
      `This will insert records into empty collections in ${DATABASE_NAME}. Type "${CONFIRMATION}" to continue: `
    );
    if (answer !== CONFIRMATION) {
      throw new SafeImportError('Confirmation did not match; no import was started.');
    }
  } finally {
    terminal.close();
  }
}

async function importSource(source) {
  await requestImportConfirmation();

  const { client, database } = await connectToDatabase();
  try {
    const initialCounts = await getTargetCounts(database);
    const nonEmpty = findNonEmptyTargets(initialCounts);
    if (nonEmpty.length > 0) {
      throw new SafeImportError(
        `Import stopped because these target collections are not empty: ${nonEmpty.join(', ')}.`
      );
    }

    const existingCollections = new Set(
      (await database.listCollections({}, { nameOnly: true }).toArray()).map(
        (collection) => collection.name
      )
    );
    for (const group of GROUPS) {
      if (!existingCollections.has(group)) {
        await database.createCollection(group);
      }
    }

    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const transactionCounts = await getTargetCounts(database, session);
        const transactionNonEmpty = findNonEmptyTargets(transactionCounts);
        if (transactionNonEmpty.length > 0) {
          throw new SafeImportError(
            `Import stopped because these target collections are not empty: ${transactionNonEmpty.join(', ')}.`
          );
        }

        for (const group of GROUPS) {
          const documents = getDocuments(source, group);
          await database.collection(group).insertMany(documents, {
            ordered: true,
            session,
          });
        }
      });
    } finally {
      await session.endSession();
    }

    const importedCounts = await getTargetCounts(database);
    stdout.write('Import complete; verified counts (no record contents displayed):\n');
    let matches = true;
    for (const group of GROUPS) {
      const expected = group === 'settings' ? 1 : source[group].length;
      const actual = importedCounts[group];
      stdout.write(`  ${group}: expected ${expected}, found ${actual}\n`);
      if (actual !== expected) matches = false;
    }

    if (!matches) {
      throw new SafeImportError('Post-import collection counts did not match the source.');
    }
  } finally {
    await client.close();
  }
}

async function main() {
  const mode = process.argv[2];
  if (!['--check-source', '--check-atlas', '--import'].includes(mode)) {
    throw new SafeImportError(
      'Choose --check-source, --check-atlas (read-only), or --import (inserts into empty collections).'
    );
  }

  const source = readSource();
  if (mode === '--check-source') {
    reportSourceCounts(source);
    return;
  }

  if (mode === '--check-atlas') {
    reportSourceCounts(source);
    process.exitCode = await checkAtlas();
    return;
  }

  reportSourceCounts(source);
  await importSource(source);
}

main().catch((error) => {
  if (error instanceof SafeImportError) {
    console.error(error.message);
  } else {
    const code = error && typeof error.code === 'number' ? ` (code ${error.code})` : '';
    console.error(`MongoDB operation failed${code}. Connection details and document data were not displayed.`);
  }
  process.exitCode = 1;
});

