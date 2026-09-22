import Link from "next/link";
import { Product } from "@/types/product";

export function ProductBreadcrumbs({ product }: { product: Product }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link href="/collection" className="hover:text-foreground transition-colors">Collection</Link>
      <span>/</span>
      <Link href={`/collection/${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
      <span>/</span>
      <span className="text-foreground">{product.name}</span>
    </nav>
  );
}
