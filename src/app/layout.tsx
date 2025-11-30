import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
  title: "Vivion Infra Facility Pvt. Ltd. | Premium Construction Services",
  description: "Vivion Infra Facility Pvt. Ltd. offers top-tier construction, renovation, and general contracting services.",
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
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
