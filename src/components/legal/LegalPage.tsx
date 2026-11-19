import { siteConfig } from "@/lib/site-config";

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}

// Pure black & white: white page with black text in light mode, inverted in dark mode.
const linkClass = "underline underline-offset-4 decoration-1 hover:no-underline";

export function LegalPage({ eyebrow, title, lastUpdated, intro, sections }: LegalPageProps) {
  const { email, phone, phoneHref, address } = siteConfig.contact;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-black dark:bg-black dark:text-white px-6 md:px-[20%]">
      <header className="mb-16 md:mb-24 pb-12 border-b border-black dark:border-white">
        <div className="text-xs tracking-widest uppercase font-medium mb-6">{eyebrow}</div>
        <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight uppercase">{title}</h1>
        <p className="mt-6 text-sm">Last updated: {lastUpdated}</p>
      </header>

      <div className="flex flex-col gap-12 font-light leading-relaxed [&_a]:underline [&_a]:underline-offset-4">
        <div className="text-lg">{intro}</div>

        {sections.map((section, i) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl md:text-3xl leading-snug">
              {i + 1}. {section.heading}
            </h2>
            <div className="flex flex-col gap-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
              {section.body}
            </div>
          </section>
        ))}

        <section className="flex flex-col gap-4 border-t border-black dark:border-white pt-12">
          <h2 className="font-serif text-2xl md:text-3xl leading-snug">Contact Us</h2>
          <p>
            {siteConfig.companyName}
            <br />
            {address.lines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            Email:{" "}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
            <br />
            Phone:{" "}
            <a href={phoneHref} className={linkClass}>
              {phone}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
