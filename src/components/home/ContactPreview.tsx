"use client";

import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useEmailForm } from "@/hooks/useEmailForm";

export default function ContactPreview() {
    const { status, formRef, sendEmail, setStatus } = useEmailForm();
    return (
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-5">
                <div className="text-center mb-16">
                    <h2 className="font-heading font-bold text-4xl text-blue-900 mb-4">
                        Get In Touch
                    </h2>
                    <div className="w-20 h-1 bg-gold mx-auto mb-5"></div>
                    <p className="text-text-light text-lg">
                        Ready to start your project? Contact us today.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Contact Info */}
                    <div className="bg-blue-900 text-white p-10 lg:col-span-1">
                        <h3 className="font-heading font-bold text-2xl mb-8 text-gold">
                            Contact Information
                        </h3>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="text-gold text-xl mt-1">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gold mb-1">Location</h4>
                                    <p className="opacity-90">
                                        Bangalore, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-gold text-xl mt-1">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gold mb-1">Phone</h4>
                                    <p className="opacity-90">+91 9845766617</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-gold text-xl mt-1">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gold mb-1">Email</h4>
                                    <p className="opacity-90">vinodh@vivionconstructions.in</p>
                                    <p className="opacity-90">info@vivionconstructions.in</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-10 lg:col-span-2">
                        <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-text-light">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-text-light">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-text-light">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-text-light">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                                    placeholder="Tell us about your project..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-gold text-blue-900 font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-gold-light hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                            >
                                {status === "loading" ? "Sending..." : "Send Message"}
                            </button>
                            {status === "error" && (
                                <p className="text-red-600 text-center font-medium animate-fadeIn">Something went wrong. Please try again.</p>
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
    );
}
