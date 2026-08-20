import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["architectural materials", "flooring", "wall solutions", "exterior surfaces", "luxury flooring", "Spacesio Beryl"],
  authors: [
    {
      name: siteConfig.companyName,
    },
  ],
  creator: siteConfig.companyName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.socialLinks.instagram,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.socialLinks.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <header className="py-4 px-6 border-b border-border text-sm">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="font-serif text-xl">{siteConfig.name}</div>
            <div className="flex gap-4">
              {siteConfig.navigation.map((item) => (
                <a key={item.name} href={item.href} className="hover:text-accent transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-8 px-6 border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
            <p>Placeholder Address: {siteConfig.contact.address}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
