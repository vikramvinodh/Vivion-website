"use client";

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

export default function PropertyPhotoGrid({ images, alt }: { images: string[]; alt: string }) {
    const imgs = images.filter(Boolean);
    const [at, setAt] = useState<number | null>(null);

    if (imgs.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {imgs.map((img, i) => (
                    <button key={img} onClick={() => setAt(i)}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                        <Image src={img} alt={alt} fill sizes="(max-width: 768px) 45vw, 200px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </button>
                ))}
            </div>
            {at !== null && (
                <Lightbox images={imgs} startIndex={at} alt={alt} onClose={() => setAt(null)} />
            )}
        </>
    );
}
