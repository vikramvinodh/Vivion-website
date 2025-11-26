import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/919845766617"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={32} />
            <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}
