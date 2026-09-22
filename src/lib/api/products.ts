import { cache } from "react";
import { Product, Category } from "@/types/product";
import { mockProducts, mockCategories } from "@/data/products";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { client } from "@/sanity/lib/client";
import { getProductsQuery, getProductBySlugQuery, getCategoriesQuery } from "@/sanity/lib/queries";
/* eslint-enable @typescript-eslint/no-unused-vars */

// TEMPORARY BYPASS: Set to false once Sanity CMS is fully populated.
const USE_MOCK_DATA = true;

export const getCategories = cache(async (): Promise<Category[]> => {
  if (USE_MOCK_DATA) return mockCategories;

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
      const cats = await client.fetch(getCategoriesQuery);
      if (cats && cats.length > 0) return cats;
    }
  } catch {
    console.error("Sanity fetch failed, falling back to local mock data.");
  }
  return mockCategories;
});

export const getProducts = cache(async (searchQuery?: string, categorySlug?: string): Promise<Product[]> => {
  let products = mockProducts;

  if (!USE_MOCK_DATA) {
    try {
      if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
        const sanityProducts = await client.fetch(getProductsQuery);
        if (sanityProducts && sanityProducts.length > 0) {
          products = sanityProducts;
        }
      }
    } catch {
      console.error("Sanity fetch failed, falling back to local mock data.");
    }
  }

  let filtered = products;

  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter(p => p.category === categorySlug);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.category.toLowerCase().includes(q)
    );
  }

  return filtered;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!USE_MOCK_DATA) {
    try {
      if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
        const sanityProduct = await client.fetch(getProductBySlugQuery, { slug });
        if (sanityProduct) return sanityProduct;
      }
    } catch {
      console.error("Sanity fetch failed, falling back to local mock data.");
    }
  }
  return mockProducts.find(p => p.slug === slug) || null;
});

export async function getRelatedProducts(product: Product, limit: number = 3): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, limit);
}
