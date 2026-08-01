"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import Lightbox from './Lightbox';

export default function PropertyGallery({ images, alt, badge }: { images: string[]; alt: string; badge?: string }) {
    const gallery = images.filter(Boolean);
    const count = gallery.length;
    const [active, setActive] = useState(0);
    const [lightboxAt, setLightboxAt] = useState<number | null>(null);

    if (count === 0) {
        return (
            <div className="w-full aspect-[16/10] rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-gray-300">
                <FiImage className="w-12 h-12 mb-2" />
                <span className="text-sm">No images available</span>
            </div>
        );
    }

    const next = () => setActive(i => (i + 1) % count);
    const prev = () => setActive(i => (i - 1 + count) % count);

    return (
        <div>
            {/* Main image — contained so nothing is cropped, with a blurred fill behind */}
            <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden bg-gray-900 group">
                {/* Blurred backdrop fills the frame without cropping the real photo */}
                <Image
                    src={gallery[active]}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover scale-110 blur-2xl opacity-40"
                />
                <Image
                    src={gallery[active]}
                    alt={alt}
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-contain"
                />

                {badge && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 text-xs font-semibold bg-white/95 text-blue-900 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> {badge}
                    </span>
                )}

                {count > 1 && (
                    <>
                        <button onClick={prev} aria-label="Previous"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-blue-900 flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition">
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={next} aria-label="Next"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-blue-900 flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition">
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                <button onClick={() => setLightboxAt(active)}
                    className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-sm font-medium bg-black/60 text-white px-3.5 py-2 rounded-lg backdrop-blur-sm hover:bg-black/75 transition">
                    <FiImage className="w-4 h-4" /> View all {count} photos
                </button>
            </div>

            {/* Thumbnails */}
            {count > 1 && (
                <div className="grid grid-cols-5 md:grid-cols-7 gap-2 mt-3">
                    {gallery.map((img, i) => (
                        <button key={img} onClick={() => setActive(i)}
                            className={`relative aspect-[4/3] rounded-lg overflow-hidden transition ${
                                active === i ? 'ring-2 ring-gold ring-offset-1' : 'opacity-70 hover:opacity-100'
                            }`}>
                            <Image src={img} alt={alt} fill sizes="120px" className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {lightboxAt !== null && (
                <Lightbox images={gallery} startIndex={lightboxAt} alt={alt} onClose={() => setLightboxAt(null)} />
            )}
        </div>
    );
}
