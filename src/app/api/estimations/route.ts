import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Estimation from '@/models/Estimation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function GET() {
    try {
        await dbConnect();
        
        let estimations = await Estimation.find({}).sort({ costPerSqFt: 1 });
        
        // Auto-seed if collection is empty
        if (estimations.length === 0) {
            await Estimation.insertMany(defaultEstimations);
            estimations = await Estimation.find({}).sort({ costPerSqFt: 1 });
        }
        
        return NextResponse.json(estimations);
    } catch (error: any) {
        console.error("Estimations GET error:", error);
        return NextResponse.json({ error: 'Failed to fetch estimations' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Strictly protect estimations configuration
        if (!session || !session.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required' }, { status: 401 });
        }
        
        await dbConnect();
        const body = await request.json();
        const { category, title, costPerSqFt, description, inclusions } = body;
        
        if (!category) {
            return NextResponse.json({ error: 'Category key is required' }, { status: 400 });
        }
        
        const estimation = await Estimation.findOne({ category });
        if (!estimation) {
            return NextResponse.json({ error: `Estimation tier '${category}' not found` }, { status: 404 });
        }
        
        if (title !== undefined) estimation.title = title;
        if (costPerSqFt !== undefined) estimation.costPerSqFt = Number(costPerSqFt);
        if (description !== undefined) estimation.description = description;
        if (inclusions !== undefined) estimation.inclusions = inclusions;
        
        await estimation.save();
        
        return NextResponse.json(estimation);
    } catch (error: any) {
        console.error("Estimations PUT error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update estimation tier' }, { status: 500 });
    }
}
