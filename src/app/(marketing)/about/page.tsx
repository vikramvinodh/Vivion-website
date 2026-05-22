import Image from "next/image";

export default function About() {
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
                    <h1 className="font-heading font-bold text-4xl md:text-6xl mb-4">About Us</h1>
                    <div className="w-20 h-1 bg-gold mx-auto"></div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-5">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Image */}
                        <div className="w-full md:w-1/2 relative">
                            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                {/* Placeholder for Owner Image - using a professional placeholder for now */}
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                    <span className="text-lg">Owner Image Placeholder</span>
                                </div>
                                {/* <Image
                                    src="/images/owner.jpg" 
                                    alt="Vinodh Kumar"
                                    fill
                                    className="object-cover"
                                /> */}
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2">
                            <span className="text-gold font-bold tracking-widest uppercase text-sm mb-2 block">Our Story</span>
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-blue-900 mb-6">
                                Building Legacy with <span className="text-gold">Integrity</span>
                            </h2>
                            <p className="text-text-light text-lg leading-relaxed mb-6">
                                Founded by <strong className="text-blue-900">Vinodh Kumar</strong>, Vivion Constructions has been a pillar of excellence in the construction industry for over <strong className="text-blue-900">20 years</strong>.
                            </p>
                            <p className="text-text-light text-lg leading-relaxed mb-8">
                                With a passion for quality and a commitment to delivering dreams, we have successfully completed more than <strong className="text-blue-900">150+ projects</strong> ranging from luxury private villas to large-scale commercial developments. Our journey is defined by trust, transparency, and an unyielding dedication to craftsmanship.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
                                    <span className="block text-4xl font-bold text-gold mb-2">20+</span>
                                    <span className="text-blue-900 font-medium">Years Experience</span>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
                                    <span className="block text-4xl font-bold text-gold mb-2">150+</span>
                                    <span className="text-blue-900 font-medium">Projects Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision/Mission */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-10 rounded-2xl shadow-lg border-l-4 border-gold">
                            <h3 className="font-heading font-bold text-2xl text-blue-900 mb-4">Our Vision</h3>
                            <p className="text-text-light leading-relaxed">
                                To be the most trusted construction partner in India, known for transforming visions into reality through innovation, sustainability, and architectural excellence.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-lg border-l-4 border-blue-900">
                            <h3 className="font-heading font-bold text-2xl text-blue-900 mb-4">Our Mission</h3>
                            <p className="text-text-light leading-relaxed">
                                To deliver superior construction solutions that exceed client expectations, ensuring timely delivery, uncompromised quality, and lasting value in every structure we build.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
