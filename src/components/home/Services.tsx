"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Services() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    const services = [
        {
            image: "/images/services/renovation.png",
            title: "Renovation",
            description:
                "Transforming existing spaces into modern masterpieces. We breathe new life into your property with expert renovation services.",
        },
        {
            image: "/images/services/construction.png",
            title: "Constructions",
            description:
                "From foundation to finish, we handle all aspects of new construction projects with unwavering attention to detail.",
        },
        {
            image: "/images/services/private.png",
            title: "Private Projects",
            description:
                "Exclusive residential construction services for private clients, ensuring privacy and personalized design.",
        },
        {
            image: "/images/services/general.png",
            title: "General Contracting",
            description:
                "Comprehensive management of construction projects, coordinating all trades to ensure timely and quality delivery.",
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (services.length - itemsPerPage + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? services.length - itemsPerPage : prev - 1));
    };

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="container mx-auto px-5">
                <div className="text-center mb-16">
                    <h2 className="font-heading font-bold text-4xl text-blue-900 mb-4">
                        Our Expertise
                    </h2>
                    <div className="w-20 h-1 bg-gold mx-auto mb-5"></div>
                    <p className="text-text-light text-lg">
                        Delivering quality and precision in every project.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className={`shrink-0 px-4 w-full md:w-1/2 lg:w-1/3`}
                                >
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 hover:border-gold/50 h-full">
                                        <div className="relative h-64 w-full overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>
                                        </div>
                                        <div className="p-6 text-center border-b-4 border-transparent group-hover:border-gold transition-all duration-300">
                                            <h3 className="font-heading font-bold text-xl text-blue-900 mb-3 group-hover:text-gold transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-text-light text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all z-10"
                        aria-label="Previous"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all z-10"
                        aria-label="Next"
                    >
                        <FaChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
