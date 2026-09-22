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
  type: "wood" | "stone" | "spc" | "vinyl" | "carpet" | "fabric" | "exterior" | "other";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "flooring" | "wall" | "window" | "exterior";
  subcategory: string; // e.g., "Engineered Wood", "SPC"
  description: string;
  shortDescription: string;
  heroImage?: string;
  images: string[]; // URLs
  specifications: ProductSpecification[];
  finishes: ProductFinish[];
  applications: string[]; // e.g., "Residential", "Commercial"
  tags: string[]; // e.g., "Natural", "Brushed", "Grey"
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
