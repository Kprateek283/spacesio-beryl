import Link from "next/link";
import { Product } from "@/types/product";

export function ProductBreadcrumbs({ product }: { product: Product }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-3 text-xs font-medium tracking-widest uppercase text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link href="/collection" className="inline-flex items-center min-h-[44px] hover:text-foreground transition-colors">Collection</Link>
      <span>/</span>
      <Link href={`/collection/${product.category}`} className="inline-flex items-center min-h-[44px] hover:text-foreground transition-colors">{product.category}</Link>
      <span>/</span>
      <span className="text-foreground">{product.name}</span>
    </nav>
  );
}
