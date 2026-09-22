import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mt-32 pt-24 border-t border-border">
      <h2 className="font-serif text-3xl md:text-4xl tracking-tight uppercase mb-12 text-center md:text-left">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
