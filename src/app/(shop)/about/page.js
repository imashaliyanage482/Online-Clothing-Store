import React from 'react';

export const metadata = {
  title: 'About Us | FashionStore Philosophy',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">About FashionStore</h1>
      <p className="text-lg leading-relaxed text-slate-600">
        FashionStore was founded with a singular conviction: clothing should be made with intention, crafted from authentic materials, and designed to outlive temporary seasonal fads.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-base">Ethical Textiles</h3>
          <p className="mt-2 text-sm text-slate-600">
            From traceable Australian Merino wool to GOTS-certified organic cotton, every fabric is chosen for touch, drape, and footprint.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-base">Artisanal Tailoring</h3>
          <p className="mt-2 text-sm text-slate-600">
            We partner with legacy ateliers who treat seam construction, reinforced linings, and button fixtures with surgical precision.
          </p>
        </div>
      </div>
    </div>
  );
}
