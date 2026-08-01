"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
    images: string[];
    startIndex: number;
    alt: string;
    onClose: () => void;
}

export default function Lightbox({ images, startIndex, alt, onClose }: Props) {
    const [active, setActive] = useState(startIndex);
    const count = images.length;

    const next = useCallback(() => setActive(i => (i + 1) % count), [count]);
    const prev = useCallback(() => setActive(i => (i - 1 + count) % count), [count]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [next, prev, onClose]);

    return (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center" onClick={onClose}>
            <button className="absolute top-5 right-5 text-white/80 hover:text-white p-2 z-10" onClick={onClose}>
                <FiX className="w-7 h-7" />
            </button>
            {count > 1 && (
                <button className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2 z-10"
                    onClick={(e) => { e.stopPropagation(); prev(); }}>
                    <FiChevronLeft className="w-9 h-9" />
                </button>
            )}

            <div className="relative w-[92vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <Image src={images[active]} alt={alt} fill quality={95} sizes="92vw" className="object-contain" />
            </div>

            {count > 1 && (
                <button className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2 z-10"
                    onClick={(e) => { e.stopPropagation(); next(); }}>
                    <FiChevronRight className="w-9 h-9" />
                </button>
            )}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
                {active + 1} / {count}
            </span>
        </div>
    );
}
