"use client";

import { useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';

interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 shadow-xs transition cursor-pointer"
        >
            {copied ? (
                <>
                    <FiCheck className="w-3.5 h-3.5 text-green-600" /> Copied!
                </>
            ) : (
                <>
                    <FiShare2 className="w-3.5 h-3.5" /> Share Article
                </>
            )}
        </button>
    );
}
