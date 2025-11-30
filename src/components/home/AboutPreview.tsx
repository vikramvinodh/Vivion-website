import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function AboutPreview() {
    return (
        <section id="about" className="relative py-24 bg-white text-white overflow-hidden">
            {/* Background Image - Full width, no overlay on the right */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/projects/interior.png"
                    alt="Luxury Interior"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Blue Overlay with Angled Clip Path */}
            <div
                className="absolute inset-0 bg-blue-900/95 z-10 w-full lg:w-[65%]"
                style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            ></div>

            {/* Mobile Overlay - Full coverage on small screens if needed, but the above covers enough. 
                Let's add a full overlay for mobile only if the clip-path looks bad, 
                but actually the above div will just be a rectangle on mobile if we don't apply clip-path, 
                or we can adjust clip-path for mobile. 
                Let's make it simple: on mobile, full blue overlay. On lg, clipped.
            */}
            <div
                className="absolute inset-0 bg-blue-900/95 z-10 lg:hidden"
            ></div>


            <div className="container mx-auto px-5 relative z-20">
                <div className="flex flex-col lg:flex-row items-center">
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

                    {/* Right side is empty to reveal the image */}
                    <div className="lg:w-1/2"></div>
                </div>
            </div>
        </section>
    );
}
