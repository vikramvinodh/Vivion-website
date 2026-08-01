import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// The page body is interactive (EmailJS form), so it lives in a client
// component and this server page owns the metadata.
export const metadata: Metadata = {
    title: "Contact Us — Construction Enquiries in Bangalore",
    description:
        "Get in touch with Vivion Infra Facility Pvt. Ltd. Call +91 98457 66617 or send us a message for construction, renovation, interior and property management enquiries in Bangalore.",
    alternates: { canonical: "/contact" },
    openGraph: {
        type: "website",
        url: "/contact",
        title: "Contact Vivion Infra Facility Pvt. Ltd.",
        description:
            "Call +91 98457 66617 or message us for construction, renovation and property enquiries in Bangalore.",
    },
};

export default function ContactPage() {
    return (
        <>
            <ContactContent />
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Contact", path: "/contact" },
                ])}
            />
        </>
    );
}
