import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Estimation from '@/models/Estimation';
import EstimationsCalculator from '@/components/home/EstimationsCalculator';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'House Construction Cost Calculator in Bangalore',
    description:
        'Estimate your house construction cost per sq.ft in Bangalore. Compare standard, premium and luxury packages with a full breakdown of materials and inclusions.',
    alternates: { canonical: '/estimations' },
    openGraph: {
        type: 'website',
        url: '/estimations',
        title: 'House Construction Cost Calculator in Bangalore | Vivion',
        description:
            'Estimate construction cost per sq.ft and compare package inclusions for your Bangalore build.',
    },
};

const defaultEstimations = [
    {
        category: 'basic',
        title: 'Standard Comfort',
        costPerSqFt: 1600,
        description: 'Excellent for budget-conscious standard residential projects featuring reliable foundation and solid construction specifications.',
        inclusions: [
            'Steel: FE 500/550 TMT Rebars (Rathi/Kamdhenu)',
            'Cement: OPC/PPC 43 Grade (Birla/Ultratech)',
            'Flooring: Premium Vitrified Tiles up to ₹60/sqft',
            'Windows: Aluminum powder-coated frames with clear glass',
            'Paint: Interior OBD (Oil Bound Distemper) & Exterior Apex Paint',
            'Wiring: Fire-retardant copper wires (Finolex/Polycab)',
            'Plumbing: Premium PVC & CPVC piping (Astral/Supreme)',
            'Bath fittings: Hindware/Cera sanitaryware & CP fittings'
        ]
    },
    {
        category: 'medium',
        title: 'Executive Elegance',
        costPerSqFt: 2100,
        description: 'An premium balance of high durability, superior aesthetic design, and high-end branded structural fixtures.',
        inclusions: [
            'Steel: FE 550 Tata Tiscon / Jindal Panther TMT',
            'Cement: Premium grade ACC Gold / Ultratech Super',
            'Flooring: High-quality Vitrified Tiles or Granite up to ₹100/sqft',
            'Windows: UPVC sliding windows with mesh and safety grills',
            'Paint: Interior Asian Paints Royal Luxury Emulsion & Exterior Ultima',
            'Wiring: Havells / Polycab flame-retardant wiring with modular switches',
            'Plumbing: Supreme CPVC pipes & Kohler/Jaquar CP bathroom fittings',
            'Bath fittings: Jaquar wall-mounted WC & premium wash basins'
        ]
    },
    {
        category: 'premium',
        title: 'Premium Luxury',
        costPerSqFt: 2800,
        description: 'Custom luxury finishes featuring premium Italian marble, fully automated provisions, and designer structural details.',
        inclusions: [
            'Steel: Tata Tiscon FE 550 D / Jindal Panther TMT',
            'Cement: Specialized Ultratech Premium / ACC Concrete',
            'Flooring: Imported Italian Marble or Engineered Wooden Floors up to ₹250/sqft',
            'Windows: Heavy-duty soundproof UPVC/System Aluminum windows',
            'Paint: Premium PU finishes / Royale Aspira interior paints',
            'Wiring: Fire-resistant Polycab wiring, automation cables & Legrand switches',
            'Plumbing: Silent-drain UPVC pipes & Grohe/Kohler bathroom collections',
            'Sanitary: Kohler/Duravit rimless wall-hung WC & vanity counters'
        ]
    },
    {
        category: 'max',
        title: 'Elite Sovereign',
        costPerSqFt: 3600,
        description: 'The ultimate bespoke experience. Completely custom architecture, imported premium materials, and integrated smart-home automation.',
        inclusions: [
            'Steel: Corrosion Resistant Tata Tiscon/Jindal Panther Rebars',
            'Cement: Customized premium grade high-performance cement',
            'Flooring: Luxury Italian Marble or Premium Hardwood up to ₹500/sqft',
            'Windows: Double-glazed thermally broken system windows with tinted glass',
            'Paint: Premium PU / Textured Coatings & designer wallpaper backdrops',
            'Smart Home: Fully integrated smart lighting, security, and climate controls',
            'Plumbing: Noise-canceling plumbing & premium Hansgrohe/Toto fixtures',
            'Luxury Bath: Toto Neorest smart toilets, jacuzzis, and custom quartz vanities'
        ]
    }
];

export default async function EstimationsPage() {
    await dbConnect();
    
    let estimations = await Estimation.find({}).sort({ costPerSqFt: 1 });
    
    if (estimations.length === 0) {
        await Estimation.insertMany(defaultEstimations);
        estimations = await Estimation.find({}).sort({ costPerSqFt: 1 });
    }

    return (
        <div className="pt-24 min-h-screen bg-slate-950 text-white pb-16">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-amber-500 font-semibold tracking-widest text-xs uppercase block mb-3 animate-pulse">
                        Instant Cost Configurator
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                        Construction Cost Estimator
                    </h1>
                    <div className="w-16 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        Calculate transparent construction estimates in Indian Rupees (₹) for your premium building space. Toggle packages and adjust your plot area for instant specification breakdowns.
                    </p>
                </div>

                <EstimationsCalculator initialEstimations={JSON.parse(JSON.stringify(estimations))} />
            </div>
        </div>
    );
}
