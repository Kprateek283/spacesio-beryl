export interface Solution {
  id: string;
  slug: string;
  title: string;
  description: string;
  benefits: string[];
  image?: string;
  relatedCategories: string[]; // Category slugs
}
