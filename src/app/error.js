'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App-level error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <span className="text-sm font-semibold tracking-wider text-rose-600 uppercase">System Notice</span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-600">
          We encountered an unexpected error processing your request. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
