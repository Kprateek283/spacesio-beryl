import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spacesio Beryl Studio",
  description: "Content studio for Spacesio Beryl.",
};

// Sanity Studio is a full, self-contained app with its own fixed-position
// UI. It must NOT inherit the site's Navbar/Footer/SmoothScroll layout —
// this is a separate root layout (via the `(site)` route group) so Studio
// renders in total isolation instead of overlapping the site's chrome.
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
