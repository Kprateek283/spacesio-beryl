import { cache } from "react";
import { Faq, mockFaqs } from "@/data/faqs";

export const getFaqs = cache(async (): Promise<Faq[]> => {
  return mockFaqs;
});
