/**
 * Central SEO configuration and JSON-LD builders.
 *
 * Everything Google-facing (canonical URLs, sitemap entries, structured data)
 * derives from SITE_URL, so there is exactly one place to change the domain.
 */

// The apex domain is canonical — www 307-redirects to it.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://vivionconstructions.in'
).replace(/\/$/, '');

export const SITE_NAME = 'Vivion Infra Facility Pvt. Ltd.';
export const SITE_SHORT_NAME = 'Vivion Constructions';

export const BUSINESS = {
    legalName: 'Vivion Infra Facility Pvt. Ltd.',
    phone: '+919845766617',
    email: 'info@vivionconstructions.in',
    city: 'Bengaluru',
    region: 'Karnataka',
    country: 'IN',
    logo: `${SITE_URL}/logo.png`,
} as const;

/** Turns a site-relative path into an absolute URL for canonicals and JSON-LD. */
export function absoluteUrl(path = '/'): string {
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Google truncates descriptions past ~160 chars. Trim on a word boundary so
 * generated property/blog descriptions don't get cut mid-word in the SERP.
 */
export function clampDescription(text: string, max = 158): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, clean.lastIndexOf(' ', max))}…`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

/** Identity of the site itself — helps Google resolve the brand name. */
export function websiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_SHORT_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
    };
}

/**
 * The business entity. GeneralContractor is a LocalBusiness subtype, which is
 * what surfaces in local packs for "construction company in Bangalore".
 */
export function localBusinessJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'GeneralContractor',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_URL,
        logo: BUSINESS.logo,
        image: BUSINESS.logo,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        description:
            'Vivion Infra Facility Pvt. Ltd. delivers premium construction, renovation, interior design and property management services across Bengaluru.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: BUSINESS.city,
            addressRegion: BUSINESS.region,
            addressCountry: BUSINESS.country,
        },
        areaServed: {
            '@type': 'City',
            name: BUSINESS.city,
        },
        knowsAbout: [
            'Residential construction',
            'Commercial construction',
            'Interior design',
            'Renovation',
            'Property management',
        ],
    };
}

/** One place that knows the locality landing page URL shape. */
export function localityPath(slug: string): string {
    return `/property-management/locality/${slug}`;
}

/**
 * The listings on a locality page, as an ordered list of links. Gives Google an
 * explicit map of the page's contents rather than making it infer one from the
 * card markup.
 */
export function itemListJsonLd(
    name: string,
    items: { name: string; path: string }[],
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.path),
        })),
    };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function articleJsonLd(post: {
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    createdAt: string | Date;
    authorName?: string;
}) {
    const url = absoluteUrl(`/blogs/${post.slug}`);
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.coverImage ? [post.coverImage] : undefined,
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date(post.createdAt).toISOString(),
        author: {
            '@type': 'Person',
            name: post.authorName || SITE_SHORT_NAME,
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
    };
}

/**
 * Rental listings. Rent is deliberately omitted — it's a private field on the
 * Property model, so no `offers` block is emitted.
 */
export function realEstateListingJsonLd(property: {
    slug: string;
    bhk: string;
    propertyType: string;
    locality: string;
    sqft: number;
    bathrooms: number;
    furnishing?: string;
    availability?: string;
    coverImage?: string;
    images?: string[];
    createdAt: string | Date;
}) {
    const url = absoluteUrl(`/property-management/${property.slug}`);
    const images = Array.from(
        new Set([property.coverImage, ...(property.images || [])].filter(Boolean)),
    ) as string[];

    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        '@id': url,
        url,
        name: `${property.bhk} ${property.propertyType} for rent in ${property.locality}`,
        description: `${property.bhk} ${property.propertyType} of ${property.sqft} sq.ft in ${property.locality}, Bengaluru.`,
        datePosted: new Date(property.createdAt).toISOString(),
        image: images.length ? images : undefined,
        provider: { '@id': `${SITE_URL}/#organization` },
        about: {
            '@type': 'Accommodation',
            name: `${property.bhk} ${property.propertyType}`,
            numberOfBathroomsTotal: property.bathrooms,
            floorSize: {
                '@type': 'QuantitativeValue',
                value: property.sqft,
                unitCode: 'FTK', // square foot
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: property.locality,
                addressRegion: BUSINESS.region,
                addressCountry: BUSINESS.country,
            },
        },
    };
}
