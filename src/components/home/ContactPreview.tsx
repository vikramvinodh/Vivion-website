import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactPreview() {
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
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-text-light">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-text-light">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                    placeholder="Project Inquiry"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-text-light">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                                    placeholder="Tell us about your project..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gold text-blue-900 font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-gold-light hover:shadow-lg transition-all duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
