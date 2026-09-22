"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Search } from "lucide-react";

interface ClientCollectionGridProps {
  initialProducts: Product[];
}

export function ClientCollectionGrid({ initialProducts }: ClientCollectionGridProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query) return initialProducts;
    const q = query.toLowerCase();
    return initialProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.category.toLowerCase().includes(q)
    );
  }, [initialProducts, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-border focus:border-foreground outline-none transition-colors text-sm tracking-widest placeholder:text-muted-foreground uppercase font-medium"
          />
        </div>
        <div className="text-xs tracking-widest uppercase text-muted-foreground">
          {filteredProducts.length} Materials
        </div>
      </div>
      
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
