import Link from "next/link";
import { getProductBySlug } from "@/lib/api/products";

export async function ProjectMaterials({ materialSlugs }: { materialSlugs: string[] }) {
  if (!materialSlugs || materialSlugs.length === 0) return null;

  // Resolve materials from products API
  const materials = await Promise.all(
    materialSlugs.map(slug => getProductBySlug(slug))
  );

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium tracking-widest uppercase mb-8 text-muted-foreground border-b border-border pb-4">
        Materials Used
      </h3>
      <div className="flex flex-col gap-4">
        {materials.map((mat, i) => {
          if (!mat) {
            // Fallback for unresolved mock data
            return (
              <div key={i} className="text-foreground/80 font-light tracking-wide uppercase text-sm">
                {materialSlugs[i].split('-').join(' ')}
              </div>
            );
          }
          return (
            <Link 
              key={mat.id} 
              href={`/collection/${mat.category}/${mat.slug}`}
              className="group flex items-center justify-between py-2 border-b border-transparent hover:border-border transition-colors"
            >
              <span className="text-foreground/80 font-light tracking-wide uppercase text-sm group-hover:text-foreground">
                {mat.name}
              </span>
              <span className="text-xs tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                View →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
