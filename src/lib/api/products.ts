import { cache } from "react";
import { Product, Category } from "@/types/product";
import { mockProducts, mockCategories } from "@/data/products";

export const getCategories = cache(async (): Promise<Category[]> => {
  return mockCategories;
});

export const getProducts = cache(async (searchQuery?: string, categorySlug?: string): Promise<Product[]> => {
  let filtered = mockProducts;

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
  return mockProducts.find(p => p.slug === slug) || null;
});

export async function getRelatedProducts(product: Product, limit: number = 3): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, limit);
}
