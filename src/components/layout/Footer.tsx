import Link from "next/link";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-blue-dark text-white pt-16 pb-5">
            <div className="container mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Logo & Tagline */}
                    <div className="footer-logo">
                        <div className="mb-6 relative w-80 h-28">
                            <Image
                                src="/logo.png"
                                alt="Vivion Infra"
                                fill
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Building the future, restoring the past. We deliver premium
                            construction and renovation services with a commitment to
                            excellence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 className="text-gold font-heading text-xl font-bold mb-5">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Services", href: "/#services" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-gold hover:pl-1.5 transition-all duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="footer-social">
                        <h4 className="text-gold font-heading text-xl font-bold mb-5">
                            Follow Us
                        </h4>
                        <div className="flex gap-4">
                            {[
                                { icon: FaFacebookF, href: "#" },
                                { icon: FaInstagram, href: "#" },
                                { icon: FaLinkedinIn, href: "#" },
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-blue-900 transition-all duration-300"
                                >
                                    <social.icon />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-5 text-center text-white/60 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} Vivion Infra Facility Pvt. Ltd. All
                        Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
