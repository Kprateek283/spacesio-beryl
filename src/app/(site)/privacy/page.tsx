import { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description: `How ${siteConfig.name} collects, uses and protects the personal information you share with us.`,
};

const { email } = siteConfig.contact;

const sections: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: (
      <>
        <p>We only collect personal information that you choose to give us, mainly through our contact and enquiry forms. This may include:</p>
        <ul>
          <li>Your name, email address and phone number</li>
          <li>Your company name and project location</li>
          <li>Details about your project, such as project type, materials of interest, size and any message you send</li>
          <li>The product or page you enquired from</li>
          <li>Your email address, if you subscribe to our newsletter</li>
        </ul>
        <p>
          Like most websites, our hosting provider may automatically log basic technical information such as your IP
          address, browser type and the pages you visit. This is used to keep the website secure and running reliably.
        </p>
      </>
    ),
  },
  {
    heading: "How We Use Your Information",
    body: (
      <ul>
        <li>To respond to your enquiries, sample requests and consultation requests</li>
        <li>To prepare quotations and recommend suitable materials for your project</li>
        <li>To send our newsletter, only if you have subscribed. Every email lets you unsubscribe</li>
        <li>To follow up on an ongoing project or order</li>
        <li>To protect our website against spam, abuse and fraud</li>
        <li>To comply with legal obligations</li>
      </ul>
    ),
  },
  {
    heading: "Cookies",
    body: (
      <>
        <p>Cookies are small files stored in your browser. We group the ones we use into three categories:</p>
        <ul>
          <li>
            <strong>Strictly necessary</strong> – required for the site to work, such as remembering your light or dark
            theme and your cookie choice. These are always on.
          </li>
          <li>
            <strong>Analytics</strong> – help us understand how visitors use the site so we can improve it. These are
            only set if you accept them.
          </li>
          <li>
            <strong>Marketing</strong> – help us measure our campaigns. These are only set if you accept them.
          </li>
        </ul>
        <p>
          When you first visit, we ask for your choice and no analytics or marketing cookies are set until you agree. You
          can change your choice at any time using the &ldquo;Cookie Settings&rdquo; link in the footer of every page.
          Your choice is remembered for six months.
        </p>
      </>
    ),
  },
  {
    heading: "Sharing Your Information",
    body: (
      <>
        <p>We do not sell or rent your personal information. We may share it only:</p>
        <ul>
          <li>With trusted service providers who help us run our website and communications (for example our hosting provider and our email provider, Resend), and only as needed to provide those services</li>
          <li>With installation partners or suppliers when it is needed to fulfil your project, with your knowledge</li>
          <li>When required by law, or to protect our rights, customers or the public</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Data Retention and Security",
    body: (
      <p>
        We keep your information only as long as needed to respond to you, carry out your project and meet our legal and
        accounting obligations. We use reasonable technical and organisational measures to protect it, although no method
        of transmission over the internet is completely secure.
      </p>
    ),
  },
  {
    heading: "Your Rights",
    body: (
      <p>
        In line with the Digital Personal Data Protection Act, 2023 and other applicable Indian laws, you can ask us to
        access, correct or delete the personal information we hold about you, or withdraw your consent to us contacting
        you. To make a request, email us at{" "}
        <a href={`mailto:${email}`}>
          {email}
        </a>
        .
      </p>
    ),
  },
  {
    heading: "Third-Party Links",
    body: (
      <p>
        Our website may link to other websites, such as our Instagram page. We are not responsible for the privacy
        practices of those websites, and we encourage you to read their policies.
      </p>
    ),
  },
  {
    heading: "Changes to This Policy",
    body: (
      <p>
        We may update this policy from time to time. The latest version will always be available on this page, along
        with the date it was last updated. Please also see our{" "}
        <Link href="/terms">
          Terms of Use
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="19 November 2026"
      intro={
        <p>
          {siteConfig.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This
          policy explains what personal information we collect when you use our website, how we use it, and the choices
          you have.
        </p>
      }
      sections={sections}
    />
  );
}
