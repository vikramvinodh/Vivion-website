/**
 * Renders a structured-data blob. Server component — the script tag ships in
 * the initial HTML so crawlers see it without executing JS.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            // JSON.stringify output is escaped for the one sequence that can
            // break out of a <script> block.
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, '\\u003c'),
            }}
        />
    );
}
