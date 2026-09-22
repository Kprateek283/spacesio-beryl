import { cache } from "react";
import { Faq, mockFaqs } from "@/data/faqs";
import { client } from "@/sanity/lib/client";
import { getFaqsQuery } from "@/sanity/lib/queries";

export const getFaqs = cache(async (): Promise<Faq[]> => {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
      const data = await client.fetch(getFaqsQuery);
      if (data && data.length > 0) return data;
    }
  } catch {
    console.error("Sanity fetch failed, falling back to local mock data.");
  }
  return mockFaqs;
});
