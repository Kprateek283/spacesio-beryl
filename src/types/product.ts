export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductFinish {
  id: string;
  name: string;
  image?: string;
  colorHex?: string;
}

export interface Material {
  id: string;
  name: string;
  type: "wood" | "stone" | "spc" | "vinyl" | "other";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  images: string[];
  textures?: string[];
  specifications: ProductSpecification[];
  finishes: ProductFinish[];
  applications: string[];
  brochure?: string;
  featured: boolean;
  material?: Material;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
}
