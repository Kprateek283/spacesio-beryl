import { ProductSpecification } from "@/types/product";

export function ProductSpecifications({ specs }: { specs: ProductSpecification[] }) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium tracking-widest uppercase mb-6 text-muted-foreground border-b border-border pb-2">Specifications</h3>
      <div className="flex flex-col">
        {specs.map((spec, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/50 last:border-0">
            <span className="text-foreground/70 font-light tracking-wide">{spec.name}</span>
            <span className="font-medium tracking-wide text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
