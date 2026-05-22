"use client";

import { useState } from "react";
import Image from "next/image";

export default function Projects() {
    const [filter, setFilter] = useState("All");

    const projects = [
        {
            id: 1,
            title: "Luxury Villa",
            category: "Residential",
            image: "/images/services/private.png", // Using existing image
        },
        {
            id: 2,
            title: "Modern Apartment Interior",
            category: "Interiors",
            image: "/images/projects/interior.png", // Generated image
        },
        {
            id: 3,
            title: "Corporate Office",
            category: "Commercial",
            image: "/images/services/construction.png", // Using existing image
        },
        {
            id: 4,
            title: "Fine Dining Restaurant",
            category: "Restaurants",
            image: "/images/projects/restaurant.png", // Generated image
        },
        {
            id: 5,
            title: "Urban Renovation",
            category: "Renovation",
            image: "/images/services/renovation.png", // Using existing image
        },
        {
            id: 6,
            title: "Tech Park Construction",
            category: "Commercial",
            image: "/images/services/general.png", // Using existing image
        },
    ];

    const categories = ["All", "Residential", "Commercial", "Interiors", "Restaurants", "Renovation"];

    const filteredProjects = filter === "All" ? projects : projects.filter(project => project.category === filter);

    return (
        <div className="pt-[70px]">
            {/* Hero Section */}
            <section className="relative py-20 bg-blue-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/images/hero-background.png"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto px-5 relative z-10 text-center">
                    <h1 className="font-heading font-bold text-4xl md:text-6xl mb-4">Our Projects</h1>
                    <div className="w-20 h-1 bg-gold mx-auto"></div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-5">
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${filter === cat
                                        ? "bg-blue-900 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative h-80 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-gold text-sm font-bold uppercase tracking-wider mb-1 block">
                                            {project.category}
                                        </span>
                                        <h3 className="text-white font-heading font-bold text-2xl">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
