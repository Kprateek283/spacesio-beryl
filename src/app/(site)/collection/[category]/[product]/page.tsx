import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ProductBreadcrumbs } from "@/components/products/ProductBreadcrumbs";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecifications } from "@/components/products/ProductSpecifications";
import { RelatedProducts } from "@/components/products/RelatedProducts";

type Props = { params: { category: string; product: string } };

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const product = await getProductBySlug(params.product);
  
  if (!product) {
    return { title: 'Product Not Found | Spacesio Beryl' };
  }

  const title = `${product.name} | Spacesio Beryl`;
  const description = product.shortDescription || `${product.name}, a premium ${product.subcategory || product.category} material by Spacesio Beryl.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacesioberyl.com';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/collection/${params.category}/${params.product}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/collection/${params.category}/${params.product}`,
      images: [
        {
          url: product.heroImage || product.images[0] || '',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.product);

  if (!product || product.category !== params.category) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacesioberyl.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.heroImage || product.images[0],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Spacesio Beryl"
    },
    category: product.category,
    url: `${baseUrl}/collection/${product.category}/${product.slug}`
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Collection",
      "item": `${baseUrl}/collection`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": product.category,
      "item": `${baseUrl}/collection/${product.category}`
    },{
      "@type": "ListItem",
      "position": 4,
      "name": product.name,
      "item": `${baseUrl}/collection/${product.category}/${product.slug}`
    }]
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col gap-12">

        
        <ProductBreadcrumbs product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Gallery */}
          <div className="w-full">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col">
            <div className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
              {product.subcategory}
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-tight uppercase mb-8">
              {product.name}
            </h1>
            
            <p className="text-lg text-foreground/80 font-light tracking-wide leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link 
                href={`/contact?type=sample&productSlug=${product.slug}&productName=${encodeURIComponent(product.name)}&source=product-page`}
                className="bg-foreground text-background px-8 py-4 text-xs font-medium tracking-widest uppercase text-center hover:bg-accent transition-colors"
              >
                Request a Sample
              </Link>
              <Link 
                href={`/contact?type=product&productSlug=${product.slug}&productName=${encodeURIComponent(product.name)}&source=product-page`}
                className="border border-border text-foreground px-8 py-4 text-xs font-medium tracking-widest uppercase text-center hover:border-foreground transition-colors"
              >
                Enquire About This Product
              </Link>
            </div>

            <div className="flex flex-col gap-12">
              {product.specifications && product.specifications.length > 0 && (
                <ProductSpecifications specs={product.specifications} />
              )}
              
              {product.finishes && product.finishes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium tracking-widest uppercase mb-6 text-muted-foreground border-b border-border pb-2">Available Finishes</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.finishes.map(finish => (
                      <div key={finish.id} className="flex items-center gap-3 border border-border px-4 py-2">
                        {finish.colorHex && (
                          <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: finish.colorHex }} />
                        )}
                        <span className="text-sm tracking-wide">{finish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.applications && product.applications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium tracking-widest uppercase mb-6 text-muted-foreground border-b border-border pb-2">Applications</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map(app => (
                      <span key={app} className="bg-muted px-4 py-2 text-xs tracking-widest uppercase text-foreground/70">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Demo Data Disclaimer */}
            <div className="mt-16 p-4 bg-muted/50 border border-border text-xs text-muted-foreground text-center">
              NOTE: This is development DEMO DATA. Not actual Spacesio Beryl product specifications.
            </div>

          </div>
        </div>

        <RelatedProducts products={related} />

      </div>
    </div>
  );
}
