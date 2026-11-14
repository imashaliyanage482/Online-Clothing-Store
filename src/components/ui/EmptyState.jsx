import React from 'react';
import Link from 'next/link';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are currently no items to display.',
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div className="text-center py-16 px-6 rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] max-w-lg mx-auto">
      <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
        <svg className="w-6 h-6 stroke-[1.6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="mt-4 font-serif text-xl font-bold text-[#252525]">{title}</h3>
      <p className="mt-2 text-sm text-[#252525]/75 max-w-sm mx-auto font-light leading-relaxed">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="md">{actionLabel}</Button>
            </Link>
          ) : (
            <Button size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
