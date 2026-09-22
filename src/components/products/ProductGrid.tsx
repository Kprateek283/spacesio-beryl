import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center gap-6 border-t border-border mt-8">
        <p className="font-serif text-[clamp(2rem,4vw,4rem)] leading-[0.9] uppercase tracking-tight">NO MATERIALS FOUND.</p>
        <p className="text-muted-foreground tracking-widest uppercase text-sm font-light">Try another search or browse all materials.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
