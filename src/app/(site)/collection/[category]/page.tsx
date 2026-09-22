import { getProducts, getCategories } from "@/lib/api/products";
import { CategoryNavigation } from "@/components/collection/CategoryNavigation";
import { ClientCollectionGrid } from "@/components/collection/ClientCollectionGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categories = await getCategories();
  const currentCat = categories.find(c => c.slug === params.category);
  
  if (!currentCat) {
    return { title: 'Category Not Found | Spacesio Beryl' };
  }

  return {
    title: `${currentCat.name} Collection | Spacesio Beryl`,
    description: currentCat.description || `Explore our premium collection of ${currentCat.name.toLowerCase()} for luxury architectural spaces.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categories = await getCategories();
  const currentCat = categories.find(c => c.slug === params.category);
  
  if (!currentCat) {
    notFound();
  }

  const products = await getProducts("", currentCat.slug);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight uppercase mb-4">
            {currentCat.name}
          </h1>
          <p className="text-muted-foreground tracking-wide font-light max-w-xl">
            {currentCat.description}
          </p>
        </div>
      </div>

      <CategoryNavigation categories={categories} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <ClientCollectionGrid initialProducts={products} />
      </div>
    </div>
  );
}
