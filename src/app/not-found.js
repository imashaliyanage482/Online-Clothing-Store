import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <span className="text-sm font-semibold tracking-wider text-amber-600 uppercase">404 Error</span>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="mt-3 text-base text-slate-600">
          The clothing collection or page you are looking for does not exist or has been relocated.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
