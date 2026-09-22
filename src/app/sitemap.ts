import { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/lib/api/products';
import { getProjects } from '@/lib/api/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacesioberyl.com';

  const [products, categories, projects] = await Promise.all([
    getProducts(),
    getCategories(),
    getProjects(),
  ]);

  const routes = ['', '/collection', '/projects', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/collection/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/collection/${prod.category}/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const projectRoutes = projects.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...projectRoutes];
}
