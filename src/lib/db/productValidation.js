import { getCategories, getCollections } from '@/lib/db/dataStore';
import { collectionProductCategories } from '@/lib/db/collectionProductCategories';

export function validateProductInput(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return 'Product details are required.';
  }

  if (typeof product.title !== 'string' || !product.title.trim()) {
    return 'Product title is required.';
  }

  if (product.gender === 'collection') {
    const collections = getCollections();
    const category = collectionProductCategories.find((item) => item.slug === product.categorySlug);
    const assignedSlugs = Array.isArray(product.collectionSlugs)
      ? product.collectionSlugs
      : [product.collectionSlug].filter(Boolean);
    if (!category || category.title !== product.category) {
      return 'Choose a valid collection category.';
    }
    if (!product.collectionSlug || !collections.some((item) => item.slug === product.collectionSlug)) {
      return 'Choose a valid collection for this product.';
    }
    if (!assignedSlugs.includes(product.collectionSlug)) {
      return 'The product must be assigned to its selected collection.';
    }
  } else {
    if (!['women', 'men'].includes(product.gender)) {
      return 'Choose Women or Men as the product department.';
    }

    const category = getCategories().find(
      (item) => item.gender === product.gender && item.slug === product.categorySlug
    );
    if (!category || category.title !== product.category) {
      return 'Choose a valid category for the selected department.';
    }
  }

  const price = Number(product.price);
  if (!Number.isFinite(price) || price <= 0) {
    return 'Price must be a positive amount in LKR.';
  }

  if (product.originalPrice !== null && product.originalPrice !== undefined && product.originalPrice !== '') {
    const originalPrice = Number(product.originalPrice);
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      return 'Regular price must be a positive amount in LKR.';
    }

    if (product.isSale && originalPrice <= price) {
      return 'For a Sale product, the regular price must be higher than the sale price.';
    }
  } else if (product.isSale) {
    return 'Add a regular price higher than the sale price to assign this product to Sale.';
  }

  if (product.collectionSlugs !== undefined && !Array.isArray(product.collectionSlugs)) {
    return 'Collection assignments must be a list.';
  }

  if (Array.isArray(product.collectionSlugs)) {
    const collectionSlugs = new Set(getCollections().map((collection) => collection.slug));
    if (product.collectionSlugs.some((slug) => !collectionSlugs.has(slug))) {
      return 'Choose valid collections for this product.';
    }
  }

  if (product.images !== undefined && (
    !Array.isArray(product.images) ||
    product.images.some((image) => {
      const url = typeof image === 'string' ? image : image?.url;
      return typeof url !== 'string' || !url.trim();
    })
  )) {
    return 'Product images must be a list of image URLs.';
  }

  return null;
}
