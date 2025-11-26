import Image from "next/image";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AboutPreview from "@/components/home/AboutPreview";
import ContactPreview from "@/components/home/ContactPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AboutPreview />
      <ContactPreview />
    </>
  );
}
