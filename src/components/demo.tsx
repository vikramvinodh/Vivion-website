"use client";

import React from 'react';
import InteractiveSelector, { SelectorItem } from '@/components/ui/interactive-selector';
import { FaBuilding, FaHome, FaDraftingCompass, FaHammer, FaHardHat, FaCity, FaHotel, FaLandmark, FaWarehouse, FaTree } from 'react-icons/fa';

const demoItems: SelectorItem[] = [
    {
        id: 1,
        title: "Luxury Villa Renovation",
        description: "Complete transformation of a colonial villa into a modern sanctuary.",
        image: "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&w=1200&q=80",
        icon: <FaHome size={24} />
    },
    {
        id: 2,
        title: "Skyline Office Tower",
        description: "State-of-the-art commercial complex in the heart of the city.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        icon: <FaBuilding size={24} />
    },
    {
        id: 3,
        title: "Eco-Friendly Resort",
        description: "Sustainable luxury retreat blending with nature.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        icon: <FaTree size={24} />
    },
    {
        id: 4,
        title: "Urban Loft Design",
        description: "Industrial chic meets contemporary living.",
        image: "https://images.unsplash.com/photo-1600210492486-bcc7081341dc?auto=format&fit=crop&w=1200&q=80",
        icon: <FaDraftingCompass size={24} />
    },
    {
        id: 5,
        title: "The Grand Theater",
        description: "Restoration of a historic cultural landmark.",
        image: "https://images.unsplash.com/photo-1517604931442-710c8e05296c?auto=format&fit=crop&w=1200&q=80",
        icon: <FaLandmark size={24} />
    },
    {
        id: 6,
        title: "Modern Minimalist Home",
        description: "More beautiful architecture designs.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        icon: <FaHome size={24} />
    },
    {
        id: 7,
        title: "Industrial Complex",
        description: "Efficient and robust industrial structures.",
        image: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=1200&q=80",
        icon: <FaWarehouse size={24} />
    },
    {
        id: 8,
        title: "City Center Hotel",
        description: "Luxury hospitality and accommodation.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        icon: <FaHotel size={24} />
    },
    {
        id: 9,
        title: "Corporate Headquarters",
        description: "Innovative workspace for modern business.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        icon: <FaCity size={24} />
    },
    {
        id: 10,
        title: "Tech Park Campus",
        description: "Future-ready infrastructure for technology hubs.",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
        icon: <FaHardHat size={24} />
    }
];

const DemoOne = () => {
    return (
        <div className="w-full">
            <InteractiveSelector items={demoItems} />
        </div>
    );
};

export { DemoOne };
