"use client";

import React, { useState, useEffect } from 'react';
// import { FaCampground, FaFire, FaTint, FaHotTub, FaHiking } from 'react-icons/fa'; // Removed hardcoded icons import

export interface SelectorItem {
    id: string | number;
    title: string;
    description: string;
    image: string;
    icon?: React.ReactNode;
}

interface InteractiveSelectorProps {
    items: SelectorItem[];
    title?: string;
    subtitle?: string;
    itemsPerPage?: number;
}

const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({
    items,
    title = "Our Masterpieces",
    subtitle = "Explore our premium portfolio",
    itemsPerPage = 5
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate current items based on pagination
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleOptionClick = (index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            setActiveIndex(0); // Reset active index for new batch
            setAnimatedOptions([]); // Reset animation
        } else {
            // Optional: Loop back to start? Or just disable.
            // Let's loop back for infinite "load more" feel if desired, 
            // but standard is usually stopping or resetting.
            // Let's reset to 0 for a continuous cycle feel as requested "lot of images".
            setCurrentPage(0);
            setActiveIndex(0);
            setAnimatedOptions([]);
        }
    };

    useEffect(() => {
        // Reset animations when page changes
        const timers: NodeJS.Timeout[] = [];
        setAnimatedOptions([]); // Ensure clear start

        currentItems.forEach((_, i) => {
            const timer = setTimeout(() => {
                setAnimatedOptions(prev => [...prev, i]);
            }, 100 * i); // Faster stagger
            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [currentPage, currentItems.length]); // Re-run when page changes

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[600px] w-full  font-sans text-white py-16 overflow-hidden">
            {/* Header Section */}
            <div className="w-full max-w-4xl px-6 mb-12 text-center z-10">
                <h1 className="font-heading font-bold text-4xl text-blue-900 mb-4">{title}</h1>
                <div className="w-20 h-1 bg-gold mx-auto mb-5"></div>
                <p className="text-text-light text-lg">{subtitle}</p>
            </div>

            {/* Options Container */}
            {/* responsive: flex-col on mobile, flex-row on desktop */}
            <div className="relative w-full max-w-[1200px] px-4">
                <div className="options flex flex-col md:flex-row w-full h-[600px] md:h-[450px] items-stretch gap-1 md:gap-2 overflow-hidden relative rounded-xl shadow-2xl bg-white">
                    {currentItems.map((option, index) => {
                        const isActive = activeIndex === index;
                        const isAnimated = animatedOptions.includes(index);

                        return (
                            <div
                                key={`${currentPage}-${index}`} // Unique key for animation reset
                                className={`
                  option relative flex-col justify-end overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  cursor-pointer group
                  ${isActive ? 'grow-5 md:grow-7' : 'grow'}
                  basis-0
                `}
                                style={{
                                    backgroundImage: `url('${option.image}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    opacity: isAnimated ? 1 : 0,
                                    transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
                                    // Mobile adjustments
                                }}
                                onClick={() => handleOptionClick(index)}
                            >
                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/90 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`} />

                                {/* Content */}
                                <div className={`relative z-10 flex flex-col justify-end h-full p-4 md:p-6 transition-all duration-500 ${isActive ? 'translate-y-0' : 'translate-y-0'}`}>
                                    {/* Icon Container - Optional */}
                                    {option.icon && (
                                        <div className={`
                             mb-3 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white
                             transition-all duration-500
                             ${isActive ? 'opacity-100 scale-100' : 'opacity-100 scale-90 md:opacity-0 md:-translate-y-4'}
                          `}>
                                            {option.icon}
                                        </div>
                                    )}

                                    <div className="overflow-hidden">
                                        <h3 className={`
                              text-lg md:text-2xl font-bold text-white whitespace-nowrap transition-all duration-500 delay-100
                              ${isActive ? 'opacity-100 translate-x-0' : 'opacity-100 md:opacity-0 md:-translate-x-4'}
                              ${!option.icon && !isActive ? 'hidden md:block' : ''} 
                              /* On mobile always show title? No, keeping accordion behavior is better but maybe preview title */
                          `}>
                                            {option.title}
                                        </h3>

                                        <p className={`
                              text-sm md:text-base text-gray-300 mt-2 line-clamp-2 transition-all duration-500 delay-200
                              ${isActive ? 'opacity-100 translate-y-0 max-h-20' : 'opacity-0 translate-y-4 max-h-0'}
                          `}>
                                            {option.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Border Indicator (Mobile/Desktop) */}
                                {isActive && (
                                    <div className="absolute inset-0 border-2 border-white/30 pointer-events-none rounded-none md:first:rounded-l-xl md:last:rounded-r-xl" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Control - Load More */}
            <div className="mt-8 flex gap-4 z-10">
                <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                >
                    {currentPage === totalPages - 1 ? 'Show First Set' : 'Load More Masterpieces'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>

            {/* Custom Styles not handled by Tailwind v4 directly or if needed for specific keyframes */}
            <style jsx global>{`
        @keyframes fadeInTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTop {
          animation: fadeInTop 0.8s ease-out forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
        </div>
    );
};

export default InteractiveSelector;
