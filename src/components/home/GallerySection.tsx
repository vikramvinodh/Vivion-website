"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const galleryImages = [
    {
        id: 1,
        src: "/images/hero/Gallery/IMG_8495.JPG",
        category: "Commercial",
        title: "Business Center",
    },
    {
        id: 2,
        src: "/images/hero/Gallery/86498180-8564-43E7-B1AB-E770CA2D7C58.JPG",
        category: "Interiors",
        title: "Modern Apartment",
    },
    {
        id: 4,
        src: "/images/hero/Gallery/IMG_0233.JPG",
        category: "Restaurants",
        title: "Fine Dining",
    },
    {
        id: 5,
        src: "/images/hero/Gallery/IMG_0241.JPG",
        category: "Renovation",
        title: "Urban Renovation",
    },
    {
        id: 6,
        src: "/images/hero/Gallery/IMG_0337.JPG",
        category: "Commercial",
        title: "Tech Park",
    },
    {
        id: 7,
        src: "/images/hero/Gallery/IMG_0410.JPG",
        category: "Residential",
        title: "Private Residence",
    },
    {
        id: 8,
        src: "/images/hero/Gallery/IMG_0730.JPG",
        category: "Commercial",
        title: "Office Space",
    },
    {
        id: 9,
        src: "/images/hero/Gallery/IMG_0734.JPG",
        category: "Interiors",
        title: "Interior Design",
    },
    {
        id: 10,
        src: "/images/hero/Gallery/IMG_1223.JPG",
        category: "Renovation",
        title: "Building Renovation",
    },
    {
        id: 11,
        src: "/images/hero/Gallery/IMG_1226.JPG",
        category: "Commercial",
        title: "Commercial Complex",
    },
    {
        id: 12,
        src: "/images/hero/Gallery/IMG_5506.JPG",
        category: "Residential",
        title: "Apartment Complex",
    },
    {
        id: 13,
        src: "/images/hero/Gallery/IMG_7185.JPG",
        category: "Interiors",
        title: "Modern Interior",
    },
    {
        id: 14,
        src: "/images/hero/Gallery/74956333-D626-428F-B3AA-A8ED1D387A3F.JPG",
        category: "Residential",
        title: "Luxury Villa",
    },

];

export default function GallerySection() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setSelectedImage(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((prev) =>
                prev === galleryImages.length - 1 ? 0 : (prev as number) + 1
            );
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((prev) =>
                prev === 0 ? galleryImages.length - 1 : (prev as number) - 1
            );
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-5">
                <div className="text-center mb-16">
                    <h2 className="font-custom text-4xl md:text-5xl lg:text-6xl text-blue-900 mb-4">
                        Our Masterpieces
                    </h2>
                    <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
                    <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our portfolio of premium construction and design projects,
                        showcasing our commitment to excellence and detail.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            layoutId={`gallery-image-${image.id}`}
                            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg aspect-square"
                            onClick={() => openLightbox(index)}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
                            onClick={closeLightbox}
                        >
                            <IoClose size={40} />
                        </button>

                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md"
                            onClick={prevImage}
                        >
                            <IoChevronBack size={30} />
                        </button>

                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md"
                            onClick={nextImage}
                        >
                            <IoChevronForward size={30} />
                        </button>

                        <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[16/10]">
                            <motion.div
                                key={selectedImage}
                                layoutId={`gallery-image-${galleryImages[selectedImage].id}`}
                                className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={galleryImages[selectedImage].src}
                                    alt={galleryImages[selectedImage].title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
