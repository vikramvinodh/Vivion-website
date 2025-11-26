import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle, FaProjectDiagram, FaUserTie, FaSmile } from "react-icons/fa";

export default function AboutPreview() {
    const stats = [
        { icon: FaUserTie, value: "20+", label: "Years Experience" },
        { icon: FaProjectDiagram, value: "150+", label: "Projects Delivered" },
        { icon: FaSmile, value: "100%", label: "Client Satisfaction" },
    ];

    return (
        <section id="about" className="relative py-24 bg-blue-900 text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/projects/interior.png"
                    alt="Luxury Interior"
                    fill
                    className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
            </div>

            <div className="container mx-auto px-5 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 leading-tight">
                            Why Choose <span className="text-gold">Vivion</span>?
                        </h2>
                        <div className="w-24 h-1 bg-gold mb-8"></div>
                        <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                            At Vivion Infra Facility Pvt. Ltd., we believe that every structure
                            tells a story. With a commitment to excellence and a passion for
                            innovation, we deliver construction solutions that stand the test of
                            time.
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                "Premium Quality Materials",
                                "Expert Craftsmanship",
                                "Timely Project Completion",
                                "Transparent Pricing",
                            ].map((point, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <span className="text-gold text-xl bg-white/10 p-2 rounded-full">
                                        <FaCheckCircle />
                                    </span>
                                    <span className="font-medium text-lg">{point}</span>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/about"
                            className="inline-block px-10 py-4 bg-gold text-blue-900 font-bold rounded-full uppercase tracking-wider hover:bg-white hover:text-blue-900 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`${index === 2 ? "md:col-span-2" : ""
                                        } bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 group`}
                                >
                                    <div className="text-gold text-4xl mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                        <stat.icon />
                                    </div>
                                    <div className="font-heading font-bold text-4xl md:text-5xl mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300 font-medium uppercase tracking-wide text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
