export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  description: string;
  heroImage: string;
  gallery: string[];
  materials: string[]; // slugs of products used
  completionYear: string;
  featured: boolean;
}

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    slug: "luxury-residence-new-delhi",
    title: "Luxury Residence",
    location: "New Delhi",
    category: "Residential",
    description: "A contemporary residential environment built around warm natural materials and understated architectural details. This project emphasizes seamless transitions between living spaces using engineered oak and highly textured wallpapers.",
    heroImage: "/assets/images/products/wood-1.jpg",
    gallery: [
      "/assets/images/products/wood-2.jpg",
      "/assets/images/products/wallpaper-1.jpg",
      "/assets/images/products/carpet-1.jpg",
    ],
    materials: ["oak-natural", "botanical-wallpaper-01", "roller-blind-sand"],
    completionYear: "2024",
    featured: true,
  },
  {
    id: "proj-2",
    slug: "modern-office-mumbai",
    title: "Modern Office",
    location: "Mumbai",
    category: "Commercial",
    description: "A high-performance workspace designed for collaboration and focus. Acoustic control was achieved through premium carpet tiles, while LVT corridors withstand heavy foot traffic without compromising on aesthetics.",
    heroImage: "/assets/images/products/carpet-1.jpg",
    gallery: [
      "/assets/images/products/stone-1.jpg",
      "/assets/images/products/carpet-1.jpg",
    ],
    materials: ["office-grey-carpet", "stone-grey-spc"],
    completionYear: "2023",
    featured: true,
  },
  {
    id: "proj-3",
    slug: "boutique-hospitality-goa",
    title: "Boutique Hospitality",
    location: "Goa",
    category: "Hospitality",
    description: "An experiential coastal resort where indoor and outdoor spaces blur. IPE natural decking provides durable elegance around pool areas, while warm wallpapers invite relaxation in suites.",
    heroImage: "/assets/images/products/stone-1.jpg",
    gallery: [
      "/assets/images/products/wood-1.jpg",
      "/assets/images/products/wallpaper-1.jpg",
    ],
    materials: ["ipe-natural-deck", "botanical-wallpaper-01"],
    completionYear: "2025",
    featured: false,
  },
];
