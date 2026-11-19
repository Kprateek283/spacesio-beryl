import { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "Materials with purpose. Our story, philosophy, and expertise.",
};

export default function AboutPage() {
  return <AboutContent />;
}
