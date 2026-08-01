import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const customFont = localFont({
  src: "../../public/folds/Qw3aZQNVED7rKGKxtqIqX5EUDXx4Vn8sig.woff2",
  variable: "--font-custom",
});

export const metadata: Metadata = {
  // metadataBase resolves every relative canonical/OG image below to the apex
  // domain, and is required for OG tags to be absolute.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Construction Services in Bangalore`,
    // Pages set a bare title; the brand suffix is appended here so it is
    // never hardcoded per page.
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description:
    "Vivion Infra Facility Pvt. Ltd. offers premium construction, renovation, interior design and property management services in Bangalore.",
  applicationName: SITE_SHORT_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_SHORT_NAME,
    locale: "en_IN",
    url: SITE_URL,
    title: `${SITE_NAME} | Premium Construction Services in Bangalore`,
    description:
      "Premium construction, renovation, interior design and property management across Bangalore.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Construction Services`,
    description:
      "Premium construction, renovation, interior design and property management across Bangalore.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${customFont.variable} antialiased`}
      >
        {children}
        <JsonLd data={[websiteJsonLd(), localBusinessJsonLd()]} />
      </body>
    </html>
  );
}
