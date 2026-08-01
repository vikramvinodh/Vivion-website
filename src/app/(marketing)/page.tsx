import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import GallerySection from "@/components/home/GallerySection";
import AboutPreview from "@/components/home/AboutPreview";
import ContactPreview from "@/components/home/ContactPreview";

// Latest properties come from the DB, but a live query on every crawl is a
// slow TTFB — serve a cached page and refresh hourly instead.
export const revalidate = 3600;

export const metadata: Metadata = {
  // Absolute so the homepage doesn't get the brand suffix appended twice.
  title: {
    absolute:
      "Construction, Renovation & Property Management in Bangalore | Vivion Infra",
  },
  description:
    "Vivion Infra Facility Pvt. Ltd. builds premium homes, commercial spaces and interiors across Bangalore. Explore our projects, rental listings and free construction cost calculator.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Services />
      <AboutPreview />
      <GallerySection />
      <ContactPreview />
    </>
  );
}
