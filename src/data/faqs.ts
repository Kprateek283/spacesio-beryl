export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export const mockFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "Can I request a physical sample before ordering?",
    answer: "Yes. Every product page has a \"Request a Sample\" option — send us your details and we'll ship a physical swatch so you can check color, texture, and finish in person before committing to an order.",
    category: "Ordering",
    order: 1,
  },
  {
    id: "faq-2",
    question: "What's the typical lead time on an order?",
    answer: "Lead times vary by material and quantity. In-stock items typically ship within 1–2 weeks; made-to-order or large-volume projects can take longer. We'll confirm an exact timeline once we know the scope of your project.",
    category: "Ordering",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Do you work directly with architects and interior designers?",
    answer: "Yes — a large part of our business is trade-focused. If you're specifying materials for a client project, get in touch and we'll set up a dedicated point of contact for pricing, samples, and lead times.",
    category: "Trade",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Is professional installation required?",
    answer: "It depends on the material. Some flooring and wall coverings are suited to experienced DIY installation, while others (like large-format stone or motorized blinds) should be installed by a professional. Each product page notes installation requirements.",
    category: "Installation",
    order: 4,
  },
  {
    id: "faq-5",
    question: "What's your return policy on unused materials?",
    answer: "Unopened, unused stock items can be returned within 30 days of delivery. Custom or made-to-order materials are final sale. Reach out to our team and we'll walk you through the process for your specific order.",
    category: "Ordering",
    order: 5,
  },
  {
    id: "faq-6",
    question: "Do you offer warranties on your materials?",
    answer: "Most of our flooring and exterior decking materials carry a manufacturer's warranty against structural defects. Warranty length varies by product line — details are listed on each product's specification sheet.",
    category: "Support",
    order: 6,
  },
  {
    id: "faq-7",
    question: "Is there a minimum order quantity?",
    answer: "Most materials are sold by the unit, tile, or roll with no strict minimum, though large-format items like slabs may have supplier-driven minimums. If you're unsure, send us your project size and we'll confirm what's feasible.",
    category: "Ordering",
    order: 7,
  },
];
