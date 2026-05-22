"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2, FiMapPin, FiCalendar, FiGrid, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
    id: number;
    src: string;
    category: string;
    title: string;
    location: string;
    year: string;
    area: string;
    client: string;
    scope: string;
}

const galleryImages: GalleryImage[] = [
    {
        id: 1,
        src: "/images/hero/Gallery/IMG_8495.JPG",
        category: "Commercial",
        title: "Vivion Corporate Hub",
        location: "Sector 43, Gurugram",
        year: "2024",
        area: "45,000 Sq.Ft.",
        client: "Vivion Group Ltd.",
        scope: "Turnkey Design & Build"
    },
    {
        id: 2,
        src: "/images/hero/Gallery/86498180-8564-43E7-B1AB-E770CA2D7C58.JPG",
        category: "Interiors",
        title: "Modern Minimalist Penthouse",
        location: "Golf Course Road, Gurugram",
        year: "2025",
        area: "4,800 Sq.Ft.",
        client: "Private Owner",
        scope: "Interior Architecture & Finishings"
    },
    {
        id: 3,
        src: "/images/hero/Gallery/IMG_0230.JPG",
        category: "Commercial",
        title: "Sleek Office Headquarters",
        location: "Cyber City, Gurugram",
        year: "2024",
        area: "18,500 Sq.Ft.",
        client: "Apex Tech Labs",
        scope: "Structural & Interior Contracting"
    },
    {
        id: 4,
        src: "/images/hero/Gallery/IMG_0233.JPG",
        category: "Restaurants",
        title: "The Gold Room Fine Dining",
        location: "Aerocity, New Delhi",
        year: "2025",
        area: "3,200 Sq.Ft.",
        client: "Epicurean Group",
        scope: "Theme Design & Fit-Outs"
    },
    {
        id: 5,
        src: "/images/hero/Gallery/IMG_0241.JPG",
        category: "Renovation",
        title: "Industrial Loft Transformation",
        location: "Okhla Phase III, New Delhi",
        year: "2024",
        area: "5,500 Sq.Ft.",
        client: "Design Studio Inc.",
        scope: "Retrofitting & Renovation"
    },
    {
        id: 6,
        src: "/images/hero/Gallery/IMG_0337.JPG",
        category: "Commercial",
        title: "Noida Tech Plaza",
        location: "Sector 62, Noida",
        year: "2023",
        area: "120,000 Sq.Ft.",
        client: "Noida Developers",
        scope: "Civil & RCC Frame Works"
    },
    {
        id: 7,
        src: "/images/hero/Gallery/IMG_0410.JPG",
        category: "Residential",
        title: "The Glass & Concrete Villa",
        location: "Vasant Vihar, New Delhi",
        year: "2025",
        area: "8,500 Sq.Ft.",
        client: "Jain Residences",
        scope: "Design, Structural & Finishing"
    },
    {
        id: 8,
        src: "/images/hero/Gallery/IMG_0730.JPG",
        category: "Commercial",
        title: "Executive Business Center",
        location: "Connaught Place, New Delhi",
        year: "2024",
        area: "14,000 Sq.Ft.",
        client: "Regis Corporate",
        scope: "Complete Fit-Outs"
    },
    {
        id: 9,
        src: "/images/hero/Gallery/IMG_0734.JPG",
        category: "Interiors",
        title: "Contemporary Executive Suite",
        location: "Sohna Road, Gurugram",
        year: "2024",
        area: "3,800 Sq.Ft.",
        client: "V-Suite Solutions",
        scope: "Luxury Interiors & Lighting Design"
    },
    {
        id: 10,
        src: "/images/hero/Gallery/IMG_1223.JPG",
        category: "Renovation",
        title: "Heritage Building Refurbishment",
        location: "Civil Lines, Delhi",
        year: "2023",
        area: "12,000 Sq.Ft.",
        client: "Delhi Heritage Board",
        scope: "Structural Conservation & Restoration"
    },
    {
        id: 11,
        src: "/images/hero/Gallery/IMG_1226.JPG",
        category: "Commercial",
        title: "Aura Retail Arcade",
        location: "GK-II M-Block, New Delhi",
        year: "2024",
        area: "22,000 Sq.Ft.",
        client: "Aura Retail Pvt. Ltd.",
        scope: "Façade & Structural Works"
    },
    {
        id: 12,
        src: "/images/hero/Gallery/IMG_5506.JPG",
        category: "Residential",
        title: "Signature Heights Apartment Block",
        location: "Sector 150, Noida",
        year: "2024",
        area: "320,000 Sq.Ft.",
        client: "Signature Group",
        scope: "RCC Shell Construction & Plastering"
    },
    {
        id: 13,
        src: "/images/hero/Gallery/IMG_7185.JPG",
        category: "Interiors",
        title: "Biophilic Design Office Lounge",
        location: "Golf Course Extension, Gurugram",
        year: "2025",
        area: "6,000 Sq.Ft.",
        client: "Terra Solutions",
        scope: "Green Interior Setup & Finishes"
    },
    {
        id: 14,
        src: "/images/hero/Gallery/74956333-D626-428F-B3AA-A8ED1D387A3F.JPG",
        category: "Residential",
        title: "The Meadows Villa Complex",
        location: "Sohna, Haryana",
        year: "2025",
        area: "14,500 Sq.Ft. (Each)",
        client: "Meadows Properties",
        scope: "Civil Structure & Core Development"
    }
];

const categories = ["All", "Commercial", "Residential", "Renovation", "Interiors", "Restaurants"];

export default function GallerySection() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);

    // Filter images based on active category
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredImages(galleryImages);
        } else {
            setFilteredImages(galleryImages.filter(img => img.category === selectedCategory));
        }
    }, [selectedCategory]);

    const handleNext = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
        }
    }, [lightboxIndex, filteredImages.length]);

    const handlePrev = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
        }
    }, [lightboxIndex, filteredImages.length]);

    const handleClose = () => {
        setLightboxIndex(null);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, handleNext, handlePrev]);

    return (
        <section id="masterpieces" className="py-24 bg-slate-900 text-white overflow-hidden relative">
            {/* Soft Ambient Light Glows */}
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-amber-500 font-semibold tracking-widest text-xs uppercase block mb-3">
                        Featured Portfolio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                        Our Masterpieces
                    </h2>
                    <div className="w-16 h-1 bg-amber-500 mx-auto my-6 rounded-full" />
                    <p className="text-slate-400 text-base md:text-lg">
                        Explore our portfolio of premium construction and design projects, showcasing our signature commitment to engineering excellence.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${
                                selectedCategory === category
                                    ? "bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                                    : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:text-white"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div 
                    layout 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((image, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={image.id}
                                onClick={() => setLightboxIndex(index)}
                                className="group relative aspect-4/5 rounded-xl overflow-hidden cursor-pointer bg-slate-800 border border-slate-800 hover:border-slate-700 shadow-xl transition-all duration-300"
                            >
                                {/* Next Image Wrapper */}
                                <div className="w-full h-full relative">
                                    <Image
                                        src={image.src}
                                        alt={image.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        priority={index < 4}
                                    />
                                </div>

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Interactive Icon */}
                                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FiMaximize2 className="w-4 h-4 text-amber-500" />
                                </div>

                                {/* Content Details */}
                                <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end">
                                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                                        {image.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
                                        {image.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <FiMapPin className="w-3.5 h-3.5 text-amber-500/80" />
                                        <span>{image.location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        No projects found in this category.
                    </div>
                )}
            </div>

            {/* Premium Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-lg flex items-center justify-center p-4 md:p-10 select-none"
                    >
                        {/* Exit / Close */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 z-50 p-3 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-full border border-white/10 hover:border-amber-500/50 hover:text-amber-500 transition cursor-pointer"
                        >
                            <FiX className="w-6 h-6" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-full border border-white/10 hover:border-amber-500/50 hover:text-amber-500 transition cursor-pointer active:scale-95"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-full border border-white/10 hover:border-amber-500/50 hover:text-amber-500 transition cursor-pointer active:scale-95"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>

                        {/* Lightbox Content Container */}
                        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative">
                            {/* Dynamic Animation Image Wrapper */}
                            <motion.div
                                key={lightboxIndex}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="w-full lg:w-3/5 aspect-4/3 relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
                            >
                                <Image
                                    src={filteredImages[lightboxIndex].src}
                                    alt={filteredImages[lightboxIndex].title}
                                    fill
                                    className="object-cover"
                                    sizes="60vw"
                                />
                            </motion.div>

                            {/* Details Panel */}
                            <motion.div
                                key={`details-${lightboxIndex}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="w-full lg:w-2/5 text-left bg-slate-900/50 p-6 md:p-8 rounded-xl border border-slate-800 backdrop-blur-md"
                            >
                                <span className="text-amber-500 font-bold uppercase tracking-wider text-xs px-2.5 py-1 bg-amber-500/10 rounded-md border border-amber-500/20 inline-block mb-4">
                                    {filteredImages[lightboxIndex].category}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight font-heading mb-2">
                                    {filteredImages[lightboxIndex].title}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base mb-6 pb-6 border-b border-slate-800">
                                    A hallmark project exemplifying premium craftsmanship, high-quality material sourcing, and specialized structural finishing.
                                </p>

                                {/* Specifications Grid */}
                                <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                                    <div className="flex items-start gap-2.5">
                                        <FiMapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Location</p>
                                            <p className="text-slate-200 text-sm font-semibold">{filteredImages[lightboxIndex].location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiCalendar className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Year</p>
                                            <p className="text-slate-200 text-sm font-semibold">{filteredImages[lightboxIndex].year}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiGrid className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Project Area</p>
                                            <p className="text-slate-200 text-sm font-semibold">{filteredImages[lightboxIndex].area}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiUser className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Client</p>
                                            <p className="text-slate-200 text-sm font-semibold">{filteredImages[lightboxIndex].client}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Contract Scope</p>
                                    <p className="text-amber-500 font-semibold text-sm leading-relaxed">{filteredImages[lightboxIndex].scope}</p>
                                </div>

                                {/* Pagination status indicator */}
                                <div className="mt-8 text-xs text-slate-500 flex justify-between items-center">
                                    <span>Project {lightboxIndex + 1} of {filteredImages.length}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-amber-500/80">Vivion Construction Portfolio</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
