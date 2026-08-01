"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadModal from "@/components/LeadModal";

export default function Hero() {
    const [quoteOpen, setQuoteOpen] = useState(false);
    return (
        <section
            id="home"
            className="relative h-screen flex items-center justify-center text-center text-white mt-[70px] md:mt-0 overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-background.png"
                    alt="Luxury Construction"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/50"></div>
            </div>

            <div className="relative z-10 container mx-auto px-5 max-w-4xl">
                <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 leading-tight animate-[fadeInUp_0.8s_ease-out_forwards]">
                    Building Dreams with <span className="text-gold">Excellence</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards]">
                    Premium Construction & Renovation Services tailored to your vision.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center animate-[fadeInUp_0.8s_ease-out_0.4s_forwards] opacity-0 [animation-fill-mode:forwards]">
                    <Link
                        href="/#services"
                        className="px-8 py-3 bg-gold text-blue-900 font-bold rounded-full uppercase tracking-wider hover:bg-gold-light hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                        Our Services
                    </Link>
                    <button
                        onClick={() => setQuoteOpen(true)}
                        className="px-8 py-3 border-2 border-white text-white font-bold rounded-full uppercase tracking-wider hover:bg-white hover:text-blue-900 transition-all duration-300 cursor-pointer"
                    >
                        Get a Quote
                    </button>
                </div>
            </div>

            <LeadModal
                open={quoteOpen}
                onClose={() => setQuoteOpen(false)}
                title="Get a Free Quote"
                subtitle="Tell us about your project and we'll get back to you."
                source="Get a Quote"
                submitLabel="Request Quote"
            />
        </section>
    );
}
