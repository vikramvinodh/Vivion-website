"use client";

import Image from "next/image";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useEmailForm } from "@/hooks/useEmailForm";

export default function Contact() {
    const { status, formRef, sendEmail, setStatus } = useEmailForm();

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
                    <h1 className="font-heading font-bold text-4xl md:text-6xl mb-4">Contact Us</h1>
                    <div className="w-20 h-1 bg-gold mx-auto"></div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-2 block">Get in Touch</span>
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-blue-900 mb-8">
                                Let's Build Your Dream Together
                            </h2>
                            <p className="text-text-light text-lg mb-10">
                                Whether you have a question about our services, need a quote, or want to discuss a potential project, our team is here to help.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-gold flex-shrink-0">
                                        <FaPhone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg mb-1">Phone</h3>
                                        <p className="text-text-light">+91 9845766617</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-gold flex-shrink-0">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg mb-1">Email</h3>
                                        <p className="text-text-light">vinodh@vivionconstructions.in</p>
                                        <p className="text-text-light">info@vivionconstructions.in</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-gold flex-shrink-0">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg mb-1">Office</h3>
                                        <p className="text-text-light">Bangalore, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="font-heading font-bold text-2xl text-blue-900 mb-6">Send us a Message</h3>
                            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full bg-gold text-blue-900 font-bold py-4 rounded-lg hover:bg-gold-light transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === "loading" ? "Sending..." : "Send Message"}
                                </button>
                                {status === "error" && (
                                    <p className="text-red-600 text-center font-medium animate-fadeIn">Something went wrong. Please try again or contact us directly.</p>
                                )}
                            </form>

                            {/* Thank You Modal */}
                            {status === "success" && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
                                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all scale-100">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-blue-900 mb-2">Thank You!</h3>
                                        <p className="text-gray-600 mb-8">
                                            We have received your message. Our team will get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
