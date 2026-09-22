import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/collection/${product.category}/${product.slug}`} className="group flex flex-col gap-4 w-full">
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={product.images[0] || "/assets/images/landing/hero.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
          {product.subcategory}
        </div>
        <h3 className="font-serif text-2xl md:text-3xl flex justify-between items-center transition-colors group-hover:text-accent">
          {product.name}
          <span className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            →
          </span>
        </h3>
        <p className="text-sm text-foreground/70 mt-2 truncate">
          {product.tags.join(" · ")}
        </p>
        <div className="mt-4 text-xs font-medium tracking-widest uppercase border-b border-transparent w-max group-hover:border-foreground transition-colors duration-300">
          View Product
        </div>
      </div>
    </Link>
  );
}
