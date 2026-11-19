"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/types/product";
import { cn } from "@/lib/utils";

export function CategoryNavigation({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  
  const currentCategory = pathname === "/collection" ? "all" : pathname.split("/").pop();

  return (
    <div className="w-full border-b border-border mb-12 overflow-x-auto no-scrollbar">
      <div className="flex gap-6 md:gap-12 min-w-max px-6 md:px-12 max-w-[1600px] mx-auto">
        <Link 
          href="/collection" 
          className={cn(
            "inline-flex items-center min-h-[48px] py-3 border-b-2 text-sm tracking-widest uppercase transition-colors hover:text-foreground",
            currentCategory === "all" ? "text-foreground font-semibold border-foreground" : "text-muted-foreground border-transparent"
          )}
        >
          All
        </Link>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <Link 
              key={cat.id} 
              href={`/collection/${cat.slug}`}
              className={cn(
                "inline-flex items-center min-h-[48px] py-3 border-b-2 text-sm tracking-widest uppercase transition-colors hover:text-foreground",
                isActive ? "text-foreground font-semibold border-foreground" : "text-muted-foreground border-transparent"
              )}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
