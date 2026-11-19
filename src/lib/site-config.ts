export const siteConfig = {
  name: "Spacesio Beryl",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.spacesioberyl.com").replace(/\/$/, ""),
  title: "Spacesio Beryl – Premium Flooring, Wall & Exterior Surfaces",
  description:
    "Spacesio Beryl offers premium architectural flooring, wall coverings, window and exterior surface solutions for luxury residential and commercial spaces.",
  companyName: "Spacesio Beryl",
  navigation: [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    // { name: "Visualizer", href: "/visualizer" },
  ],
  socialLinks: {
    instagram: "https://www.instagram.com/spacesio_beryl/",
    linkedin: "https://linkedin.com/company/spacesio-beryl-placeholder",
    twitter: "https://twitter.com/spacesio-beryl-placeholder",
  },
  contact: {
    phone: "+91 93184 07041",
    phoneHref: "tel:+919318407041",
    // International format, digits only (used for wa.me links)
    whatsapp: "919318407041",
    email: "info@spacesioberyl.com",
    address: {
      street: "Chauhan Tower, A-25, Vihar Road, Madhu Vihar, I.P. Extension",
      lines: ["Chauhan Tower, A-25, Vihar Road", "Madhu Vihar, I.P. Extension", "New Delhi 110092"],
      locality: "New Delhi",
      region: "Delhi",
      postalCode: "110092",
      country: "IN",
    },
    hours: { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
  },
  mainCta: {
    label: "Explore Collection",
    href: "/collection",
  },
};

export type SiteConfig = typeof siteConfig;
