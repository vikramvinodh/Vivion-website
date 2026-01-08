"use client";

import InteractiveSelector, { SelectorItem } from '@/components/ui/interactive-selector';
import { FaBuilding, FaHome, FaDraftingCompass, FaHammer, FaUtensils } from 'react-icons/fa';

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

// Helper to map category to icon
const getIconForCategory = (category: string) => {
    switch (category) {
        case 'Commercial': return <FaBuilding size={24} />;
        case 'Residential': return <FaHome size={24} />;
        case 'Renovation': return <FaHammer size={24} />;
        case 'Interiors': return <FaDraftingCompass size={24} />;
        case 'Restaurants': return <FaUtensils size={24} />;
        default: return <FaBuilding size={24} />;
    }
}

const items: SelectorItem[] = galleryImages.map(img => ({
    id: img.id,
    title: img.title,
    description: img.category, // Using category as description
    image: img.src,
    icon: getIconForCategory(img.category)
}));

export default function GallerySection() {
    return (
        <section className="bg-gray-50">
            {/* The InteractiveSelector includes its own container and headers, but we might want to override or wrap if consistent layout is needed. 
                 Since the component has its own 'Our Masterpieces' title processing, we can rely on that or pass props.
             */}
            <InteractiveSelector
                items={items}
                title="Our Masterpieces"
                subtitle="Explore our portfolio of premium construction and design projects"
            />
        </section>
    );
}
