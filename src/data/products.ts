import { Product, Category } from "@/types/product";

// DEV/DEMO DATA ONLY
// NOT ACTUAL SPACIESIO BERYL PRODUCTS

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "wood",
    name: "Wood Solutions",
    description: "Premium engineered and solid wood flooring.",
  },
  {
    id: "cat-2",
    slug: "stone",
    name: "Stone Surfaces",
    description: "Architectural stone finishes.",
  }
];

export const products: Product[] = [
  {
    id: "prod-1",
    slug: "oak-natural",
    name: "Oak Natural",
    category: "wood",
    subcategory: "Engineered Wood",
    description: "A beautiful natural oak finish for modern spaces.",
    shortDescription: "Natural oak finish.",
    images: [],
    specifications: [
      { name: "Thickness", value: "14mm" },
      { name: "Wear Layer", value: "3mm" }
    ],
    finishes: [],
    applications: ["Residential", "Commercial"],
    featured: true,
  },
  {
    id: "prod-2",
    slug: "walnut-classic",
    name: "Walnut Classic",
    category: "wood",
    subcategory: "Hardwood",
    description: "Rich, dark walnut hardwood for a luxurious feel.",
    shortDescription: "Classic dark walnut.",
    images: [],
    specifications: [
      { name: "Thickness", value: "18mm" },
    ],
    finishes: [],
    applications: ["Residential"],
    featured: false,
  },
  {
    id: "prod-3",
    slug: "stone-grey",
    name: "Stone Grey",
    category: "stone",
    subcategory: "SPC",
    description: "Durable SPC flooring with a sleek stone grey appearance.",
    shortDescription: "Grey stone SPC.",
    images: [],
    specifications: [
      { name: "Thickness", value: "5mm" },
      { name: "Waterproof", value: "Yes" }
    ],
    finishes: [],
    applications: ["Commercial", "High Traffic"],
    featured: true,
  }
];
