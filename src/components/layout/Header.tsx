"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from '../../../public/logo.png'

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: "Projects", href: "/projects" },
        { name: "About Us", href: "/about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 shadow-md py-3" : "bg-white/95 shadow-sm py-4"
                }`}
        >
            <div className="container mx-auto px-5 flex justify-between items-center">
                {/* Logo */}
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-40 h-12">
                        <Image
                            src={logo}
                            alt="Vivion Infra"
                            fill
                            className="object-contain scale-100"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="font-medium text-blue-900 relative hover:text-blue-800 transition-colors after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/contact"
                            className="px-5 py-2 border border-blue-900 rounded text-blue-900 font-medium hover:bg-blue-900 hover:text-white transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl text-blue-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <ul className="flex flex-col items-center py-5 gap-5">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="font-medium text-blue-900 text-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/contact"
                            className="px-6 py-2 bg-blue-900 text-white rounded font-medium hover:bg-blue-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
