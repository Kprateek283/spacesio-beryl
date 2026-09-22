import { Product, Category } from "@/types/product";

export const mockCategories: Category[] = [
  { id: "cat-1", slug: "flooring", name: "Flooring", description: "Premium architectural flooring solutions." },
  { id: "cat-2", slug: "wall", name: "Wall", description: "Exceptional wall coverings and wallpapers." },
  { id: "cat-3", slug: "window", name: "Window", description: "Elegant window blinds and treatments." },
  { id: "cat-4", slug: "exterior", name: "Exterior", description: "Durable and beautiful outdoor surfaces." },
];

export const mockProducts: Product[] = [
  // ---------------------------------------------------------
  // FLOORING
  // ---------------------------------------------------------
  {
    id: "prod-1",
    slug: "oak-natural-engineered",
    name: "Oak Natural Engineered",
    category: "flooring",
    subcategory: "Engineered Wood",
    description: "A beautiful natural oak finish that brings warmth and authenticity to modern spaces. Features a brushed texture highlighting the natural grain, perfectly engineered for underfloor heating.",
    shortDescription: "Natural oak engineered wood with brushed finish.",
    images: [
      "/assets/images/landing/material-wood.jpg",
      "/assets/images/products/wood-1.jpg", 
      "/assets/images/products/wood-2.jpg"
    ],
    specifications: [
      { name: "Construction", value: "Multi-layer Engineered" },
      { name: "Thickness", value: "14mm (3mm top layer)" },
      { name: "Dimensions", value: "190 × 1900mm" },
      { name: "Installation", value: "Floating / Glue-down" }
    ],
    finishes: [
      { id: "f-nat", name: "Natural Matte", colorHex: "#d2b48c" },
      { id: "f-smk", name: "Smoked Oak", colorHex: "#8b5a2b" },
      { id: "f-wht", name: "White Washed", colorHex: "#e3dac9" }
    ],
    applications: ["Residential", "Commercial", "Hospitality"],
    tags: ["Natural", "Brushed", "Wood", "Light", "Oak"],
    featured: true,
  },
  {
    id: "prod-2",
    slug: "walnut-classic-hardwood",
    name: "Walnut Classic Hardwood",
    category: "flooring",
    subcategory: "Hardwood",
    description: "Rich, dark walnut solid hardwood for a luxurious and timeless feel. This premium flooring offers unparalleled longevity and can be sanded and refinished multiple times over its lifespan.",
    shortDescription: "Classic dark walnut solid hardwood flooring.",
    images: [
      "/assets/images/products/wood-2.jpg",
      "/assets/images/products/wood-1.jpg"
    ],
    specifications: [
      { name: "Construction", value: "Solid Hardwood" },
      { name: "Thickness", value: "18mm" },
      { name: "Dimensions", value: "150 × Random Length (400-1200mm)" },
      { name: "Finish", value: "UV Lacquered" }
    ],
    finishes: [
      { id: "f-drk", name: "Deep Espresso", colorHex: "#3b2f2f" },
      { id: "f-nat", name: "Natural Walnut", colorHex: "#5c4033" }
    ],
    applications: ["Residential", "Executive Offices"],
    tags: ["Dark", "Smooth", "Walnut", "Brown", "Solid"],
    featured: false,
  },
  {
    id: "prod-3",
    slug: "versailles-oak-parquet",
    name: "Versailles Oak Parquet",
    category: "flooring",
    subcategory: "Parquet",
    description: "Intricate traditional French parquet flooring. The Versailles pattern brings historical grandeur and geometric precision to luxury interiors.",
    shortDescription: "Traditional French pattern oak parquet flooring.",
    images: [
      "/assets/images/landing/material-wood.jpg",
      "/assets/images/products/wood-1.jpg"
    ],
    specifications: [
      { name: "Construction", value: "Engineered Parquet Panel" },
      { name: "Dimensions", value: "800 × 800mm" },
      { name: "Thickness", value: "20mm" }
    ],
    finishes: [
      { id: "f-ant", name: "Antique Oak", colorHex: "#8b5a2b" }
    ],
    applications: ["Luxury Residential", "Hospitality"],
    tags: ["Parquet", "Versailles", "Pattern", "Classic"],
    featured: true,
  },
  {
    id: "prod-4",
    slug: "stone-grey-spc",
    name: "Stone Grey SPC",
    category: "flooring",
    subcategory: "SPC",
    description: "Durable rigid core SPC (Stone Polymer Composite) flooring with a sleek stone grey appearance. 100% waterproof, highly resilient, and perfect for high-traffic commercial areas or wet residential spaces.",
    shortDescription: "Grey stone SPC waterproof rigid core flooring.",
    images: [
      "/assets/images/products/stone-1.jpg",
      "/assets/images/landing/material-resilient.jpg"
    ],
    specifications: [
      { name: "Construction", value: "Stone Polymer Composite" },
      { name: "Thickness", value: "5.5mm (including 1.5mm acoustic pad)" },
      { name: "Waterproof", value: "100% Yes" },
      { name: "Installation", value: "Click Lock (Unilin)" }
    ],
    finishes: [
      { id: "f-gry", name: "Concrete Grey", colorHex: "#808080" },
      { id: "f-cha", name: "Charcoal", colorHex: "#36454f" }
    ],
    applications: ["Commercial", "Healthcare", "Hospitality", "Residential Bathrooms"],
    tags: ["Grey", "Waterproof", "Stone-look", "Matte", "SPC"],
    featured: true,
  },
  {
    id: "prod-5",
    slug: "luxury-vinyl-plank-dpc",
    name: "Acoustic Oak DPC",
    category: "flooring",
    subcategory: "DPC",
    description: "Premium Digital Polymer Composite (DPC) flooring offering the hyper-realistic look of natural wood with unmatched acoustic dampening and scratch resistance.",
    shortDescription: "High-performance DPC flooring with wood visuals.",
    images: [
      "/assets/images/landing/material-resilient.jpg",
      "/assets/images/products/wood-1.jpg"
    ],
    specifications: [
      { name: "Construction", value: "Digital Polymer Composite" },
      { name: "Wear Layer", value: "0.55mm Commercial Grade" },
      { name: "Acoustic Rating", value: "21dB Reduction" }
    ],
    finishes: [],
    applications: ["Multi-family Residential", "Retail", "Office"],
    tags: ["Wood-look", "Waterproof", "Acoustic", "DPC"],
    featured: false,
  },
  
  // ---------------------------------------------------------
  // WALLS
  // ---------------------------------------------------------
  {
    id: "prod-6",
    slug: "botanical-wallpaper-01",
    name: "Botanical Serenity Wallpaper",
    category: "wall",
    subcategory: "Wallpaper",
    description: "Premium textured wallpaper featuring subtle botanical patterns for a calming atmosphere. Printed on high-grade non-woven backing for easy installation and removal.",
    shortDescription: "Textured botanical pattern luxury wallpaper.",
    images: [
      "/assets/images/products/wallpaper-1.jpg",
      "/assets/images/landing/material-wall.jpg"
    ],
    specifications: [
      { name: "Roll Size", value: "10m × 53cm" },
      { name: "Material", value: "Heavyweight Non-woven" },
      { name: "Washable", value: "Extra Washable" },
      { name: "Pattern Repeat", value: "64cm Straight Match" }
    ],
    finishes: [
      { id: "f-slv", name: "Silver Sage", colorHex: "#b2beb5" },
      { id: "f-gld", name: "Golden Morning", colorHex: "#d4af37" }
    ],
    applications: ["Residential", "Hospitality", "Feature Walls"],
    tags: ["Pattern", "Textured", "Botanical", "Wallpaper"],
    featured: true,
  },
  {
    id: "prod-7",
    slug: "architectural-slat-panel",
    name: "Acoustic Oak Slat Panel",
    category: "wall",
    subcategory: "Acoustic Panels",
    description: "Modern architectural wood slat panels bonded to high-density acoustic felt. Instantly upgrades any room visually while significantly reducing echo and reverberation.",
    shortDescription: "Wood slat acoustic wall paneling.",
    images: [
      "/assets/images/landing/material-wall.jpg",
      "/assets/images/products/wood-2.jpg"
    ],
    specifications: [
      { name: "Dimensions", value: "2400 × 600 × 22mm" },
      { name: "Material", value: "MDF Core with Real Wood Veneer + PET Felt" },
      { name: "Acoustic Rating", value: "Class A (when installed with battens)" }
    ],
    finishes: [
      { id: "f-oak", name: "Natural Oak", colorHex: "#d2b48c" },
      { id: "f-blk", name: "Smoked Black", colorHex: "#1a1a1a" },
      { id: "f-wln", name: "Walnut", colorHex: "#5c4033" }
    ],
    applications: ["Home Theater", "Office", "Restaurant", "Living Room"],
    tags: ["Wood", "Slats", "Acoustic", "Modern"],
    featured: true,
  },

  // ---------------------------------------------------------
  // WINDOW BLINDS
  // ---------------------------------------------------------
  {
    id: "prod-8",
    slug: "motorized-roller-blind-sand",
    name: "Motorized Roller Blind",
    category: "window",
    subcategory: "Blinds",
    description: "Smart motorized light-filtering roller blinds in a warm sand tone. Integrates seamlessly with smart home systems for automated light control throughout the day.",
    shortDescription: "Smart motorized light-filtering roller blind.",
    images: [
      "/assets/images/landing/blinds.jpg",
      "/assets/images/landing/solutions.jpg"
    ],
    specifications: [
      { name: "Opacity", value: "Light Filtering (5% openness)" },
      { name: "Material", value: "PVC free screen fabric" },
      { name: "Motor", value: "Somfy Ultra-Quiet" },
      { name: "Control", value: "Remote / App / Voice" }
    ],
    finishes: [
      { id: "f-snd", name: "Warm Sand", colorHex: "#c2b280" },
      { id: "f-wht", name: "Pure White", colorHex: "#f8f9fa" },
      { id: "f-chc", name: "Charcoal", colorHex: "#36454f" }
    ],
    applications: ["Residential", "Corporate Office", "High-end Retail"],
    tags: ["Smart", "Motorized", "Fabric", "Light-Filtering"],
    featured: false,
  },
  {
    id: "prod-9",
    slug: "venetian-wood-blinds",
    name: "Venetian Basswood Blinds",
    category: "window",
    subcategory: "Blinds",
    description: "Classic Venetian blinds crafted from lightweight, warp-resistant basswood. Offers precise control over privacy and sunlight direction.",
    shortDescription: "Premium natural basswood venetian blinds.",
    images: [
      "/assets/images/landing/blinds.jpg"
    ],
    specifications: [
      { name: "Slat Size", value: "50mm" },
      { name: "Material", value: "100% Basswood" },
      { name: "Operation", value: "Cord / Wand tilt" }
    ],
    finishes: [
      { id: "f-oak", name: "Oak", colorHex: "#d2b48c" },
      { id: "f-wht", name: "Painted White", colorHex: "#ffffff" }
    ],
    applications: ["Residential", "Office"],
    tags: ["Wood", "Venetian", "Classic"],
    featured: false,
  },

  // ---------------------------------------------------------
  // EXTERIOR / DECKING
  // ---------------------------------------------------------
  {
    id: "prod-10",
    slug: "ipe-natural-decking",
    name: "IPE Natural Decking",
    category: "exterior",
    subcategory: "Decking",
    description: "Extremely durable natural IPE (Brazilian Walnut) wood for outdoor decking. Known as the 'ironwood', IPE naturally resists rot, decay, and insects without chemical treatments.",
    shortDescription: "Premium ultra-durable natural IPE wood decking.",
    images: [
      "/assets/images/landing/deck.jpg",
      "/assets/images/landing/project-1.jpg"
    ],
    specifications: [
      { name: "Material", value: "Solid IPE Hardwood" },
      { name: "Lifespan", value: "50+ Years" },
      { name: "Fire Rating", value: "Class A (Same as concrete)" },
      { name: "Maintenance", value: "Oil annually or allow to silver" }
    ],
    finishes: [],
    applications: ["Outdoor Decks", "Pool Surrounds", "Commercial Boardwalks"],
    tags: ["Wood", "Outdoor", "Natural", "Decking", "IPE"],
    featured: true,
  },
  {
    id: "prod-11",
    slug: "composite-shield-decking",
    name: "Composite Shield Decking",
    category: "exterior",
    subcategory: "Decking",
    description: "Co-extruded composite decking offering the beauty of natural wood with absolutely zero maintenance. Capped with a tough polymer shield to prevent staining, fading, and scratching.",
    shortDescription: "Zero-maintenance capped composite decking.",
    images: [
      "/assets/images/landing/deck.jpg"
    ],
    specifications: [
      { name: "Material", value: "Recycled Wood Fiber + HDPE Polymer" },
      { name: "Profile", value: "Solid Core, Grooved for hidden fasteners" },
      { name: "Warranty", value: "25-Year Fade & Stain" }
    ],
    finishes: [
      { id: "f-tk", name: "Teak", colorHex: "#9b7653" },
      { id: "f-ag", name: "Ash Grey", colorHex: "#b2beb5" }
    ],
    applications: ["Residential Patios", "Balconies"],
    tags: ["Composite", "Outdoor", "Low-Maintenance", "Decking"],
    featured: false,
  }
];
