import { getProducts, getCategories } from "@/lib/api/products";
import { CategoryNavigation } from "@/components/collection/CategoryNavigation";
import { ClientCollectionGrid } from "@/components/collection/ClientCollectionGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Material Collection | Spacesio Beryl",
  description: "Explore our premium collection of flooring, wall coverings, and architectural surfaces designed for exceptional luxury spaces.",
};

export default async function CollectionPage() {
  const products = await getProducts("", "all");
  const categories = await getCategories();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight uppercase mb-4">
            Collection
          </h1>
        </div>
      </div>

      <CategoryNavigation categories={categories} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <ClientCollectionGrid initialProducts={products} />
      </div>
    </div>
  );
}
