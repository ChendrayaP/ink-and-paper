import type { Metadata } from "next";
import { inter, newsreader } from "./fonts";
import { siteConfig } from "@/lib/config";
import { OG_IMAGE_DEFAULT, OG_IMAGE_DIMENSIONS } from "@/lib/seo";
import { RecoveryGate } from "@/components/auth/RecoveryGate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} — ${siteConfig.author}`,
    template: `%s — ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} — ${siteConfig.author}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      { url: OG_IMAGE_DEFAULT, ...OG_IMAGE_DIMENSIONS, alt: siteConfig.brand },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} — ${siteConfig.author}`,
    description: siteConfig.description,
    images: [OG_IMAGE_DEFAULT],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>
        <RecoveryGate />
        {children}
      </body>
    </html>
  );
}
