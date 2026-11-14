'use client';

import React from 'react';
import CollectionLandingPage from '@/components/shop/CollectionLandingPage';

export default function DynamicCollectionPage({ params }) {
  return <CollectionLandingPage slug={params.slug} />;
}
