"use client";

import { useState, useEffect } from 'react';
import { FiPhone, FiX, FiCheckCircle, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';

interface LeadModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    source: string; // identifies the lead origin, saved with the enquiry
    submitLabel?: string;
    propertySlug?: string;
    propertyTitle?: string;
}

export default function LeadModal({
    open,
    onClose,
    title = 'Get in touch',
    subtitle,
    source,
    submitLabel = 'Send Enquiry',
    propertySlug = '',
    propertyTitle = '',
}: LeadModalProps) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

    // Lock body scroll while open, close on Escape.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleClose = () => {
        onClose();
        // Reset after the closing transition so the form is fresh next time.
        setTimeout(() => { setDone(false); setError(''); setForm({ name: '', phone: '', email: '', message: '' }); }, 200);
    };

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, source, propertySlug, propertyTitle }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');
            setDone(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const inputCls = 'w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4';

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-[fadeIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1">
                    <FiX className="w-5 h-5" />
                </button>

                {done ? (
                    <div className="p-10 text-center">
                        <FiCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-900">Enquiry Sent!</h3>
                        <p className="text-gray-500 mt-2 text-sm">
                            Thanks, {form.name || 'there'}. Our team will reach out to you shortly.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-6 px-6 py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="p-6 md:p-8">
                        <h3 className="text-xl font-bold text-blue-900">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}

                        {error && <div className="mt-4 bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

                        <form onSubmit={submit} className="mt-5 space-y-3.5">
                            <div className="relative">
                                <FiUser className={iconCls} />
                                <input name="name" value={form.name} onChange={handle} className={inputCls} placeholder="Your name" required />
                            </div>
                            <div className="relative">
                                <FiPhone className={iconCls} />
                                <input name="phone" type="tel" value={form.phone} onChange={handle} className={inputCls} placeholder="Phone number" required />
                            </div>
                            <div className="relative">
                                <FiMail className={iconCls} />
                                <input name="email" type="email" value={form.email} onChange={handle} className={inputCls} placeholder="Email (optional)" />
                            </div>
                            <div className="relative">
                                <FiMessageSquare className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                <textarea name="message" value={form.message} onChange={handle} rows={3}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Message (optional)" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gold text-blue-900 font-bold hover:bg-gold-light transition disabled:opacity-60"
                            >
                                {loading ? 'Sending…' : submitLabel}
                            </button>
                            <p className="text-center text-xs text-gray-400">We&apos;ll never share your details.</p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
