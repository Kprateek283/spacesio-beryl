export interface Project {
  id: string;
  slug: string;
  title: string;
  client?: string;
  location?: string;
  completionYear?: number;
  description: string;
  images: string[];
  productsUsed: string[]; // Product IDs
  featured: boolean;
}
