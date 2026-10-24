const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash('Admin@FashionStore2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashionstore.com' },
    update: {},
    create: {
      email: 'admin@fashionstore.com',
      name: 'System Administrator',
      phone: '+1-555-0199',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created/upserted:', admin.email);

  // 2. Seed Customer User
  const customerPassword = await bcrypt.hash('Customer@123456', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Jane Doe',
      phone: '+1-555-0144',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created/upserted:', customer.email);

  // 3. Seed Default Categories
  const categoriesData = [
    { name: "Women's Collection", slug: 'womens-collection', description: 'Contemporary & classic apparel for women' },
    { name: "Men's Collection", slug: 'mens-collection', description: 'Tailored suits, casual wear, and essentials' },
    { name: 'Accessories', slug: 'accessories', description: 'Bags, belts, sunglasses, and finishing touches' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Apparel categories seeded.');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
