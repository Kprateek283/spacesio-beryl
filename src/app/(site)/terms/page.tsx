import { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
  description: `The terms that apply when you use the ${siteConfig.name} website.`,
};

const sections: LegalSection[] = [
  {
    heading: "Use of This Website",
    body: (
      <p>
        You may use this website to learn about our products and services and to contact us. You agree not to misuse the
        website, including by attempting to gain unauthorised access, interfering with its operation, submitting false or
        spam enquiries, or using it for any unlawful purpose.
      </p>
    ),
  },
  {
    heading: "Product Information",
    body: (
      <>
        <p>
          We try to keep all product descriptions, specifications and images accurate and up to date. However, natural
          materials such as wood and stone vary in colour, grain and texture, and colours may look different on different
          screens. Images are for illustration only.
        </p>
        <p>
          We recommend viewing physical samples before making a decision. Product availability and specifications may
          change without notice.
        </p>
      </>
    ),
  },
  {
    heading: "Enquiries, Quotations and Orders",
    body: (
      <p>
        Submitting an enquiry through this website does not create a contract or a confirmed order. Prices, quotations,
        delivery timelines and installation terms are confirmed separately in writing, and any order is governed by the
        terms set out in that quotation or agreement.
      </p>
    ),
  },
  {
    heading: "Intellectual Property",
    body: (
      <p>
        All content on this website, including text, photographs, project images, logos and design, belongs to{" "}
        {siteConfig.companyName} or its licensors and is protected by copyright and other laws. You may not copy,
        reproduce or use it for commercial purposes without our written permission.
      </p>
    ),
  },
  {
    heading: "Third-Party Links",
    body: (
      <p>
        This website may contain links to third-party websites and social media platforms. We do not control and are not
        responsible for their content or practices.
      </p>
    ),
  },
  {
    heading: "Limitation of Liability",
    body: (
      <p>
        This website and its content are provided &ldquo;as is&rdquo;. To the fullest extent permitted by law,{" "}
        {siteConfig.companyName} is not liable for any indirect or consequential loss arising from your use of this
        website or reliance on its content. Nothing in these terms limits any rights you have under applicable consumer
        protection law.
      </p>
    ),
  },
  {
    heading: "Privacy",
    body: (
      <p>
        Your use of this website is also governed by our{" "}
        <Link href="/privacy">
          Privacy Policy
        </Link>
        , which explains how we handle your personal information.
      </p>
    ),
  },
  {
    heading: "Governing Law",
    body: (
      <p>
        These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the
        courts in New Delhi.
      </p>
    ),
  },
  {
    heading: "Changes to These Terms",
    body: (
      <p>
        We may update these terms from time to time. The latest version will always be available on this page. By
        continuing to use the website after changes are posted, you accept the updated terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      lastUpdated="19 November 2026"
      intro={
        <p>
          Welcome to the {siteConfig.companyName} website. By using this website, you agree to these terms. If you do not
          agree, please do not use the website.
        </p>
      }
      sections={sections}
    />
  );
}
