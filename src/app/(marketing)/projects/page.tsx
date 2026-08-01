import type { Metadata } from "next";
import ProjectsContent from "@/components/projects/ProjectsContent";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// The gallery filter is stateful, so the body is a client component and this
// server page owns the metadata.
export const metadata: Metadata = {
    title: "Our Projects — Villas, Interiors & Commercial Builds",
    description:
        "Browse completed Vivion Infra projects across Bangalore: luxury villas, apartment interiors, corporate offices, restaurants and renovation work.",
    alternates: { canonical: "/projects" },
    openGraph: {
        type: "website",
        url: "/projects",
        title: "Our Projects | Vivion Infra",
        description:
            "Luxury villas, apartment interiors, corporate offices and renovations delivered across Bangalore.",
    },
};

export default function ProjectsPage() {
    return (
        <>
            <ProjectsContent />
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Projects", path: "/projects" },
                ])}
            />
        </>
    );
}
