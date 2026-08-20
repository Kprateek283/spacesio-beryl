export const siteConfig = {
  name: "Spacesio Beryl",
  description: "Premium architectural flooring, wall, window, and exterior surface solutions.",
  companyName: "Spacesio Beryl",
  navigation: [
    { name: "Collection", href: "/collection" },
    { name: "Products", href: "/products" },
    { name: "Projects", href: "/projects" },
    { name: "Solutions", href: "/solutions" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Visualizer", href: "/visualizer" },
  ],
  socialLinks: {
    instagram: "https://instagram.com/spacesio-beryl-placeholder",
    linkedin: "https://linkedin.com/company/spacesio-beryl-placeholder",
    twitter: "https://twitter.com/spacesio-beryl-placeholder",
  },
  contact: {
    phone: "+1-800-PLACEHOLDER",
    email: "contact@spacesio-beryl-placeholder.com",
    address: "123 Placeholder St, Architectural District, 00000",
  },
  mainCta: {
    label: "Explore Collection",
    href: "/collection",
  },
};

export type SiteConfig = typeof siteConfig;
