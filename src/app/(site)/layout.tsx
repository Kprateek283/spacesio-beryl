import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "../globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
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
  icons: {
    icon: "/favicon.ico",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
