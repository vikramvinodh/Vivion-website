import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property, { PUBLIC_PROPERTY_FIELDS } from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/properties?page=1&limit=9&q=btm&sort=newest
// Public endpoint — returns ONLY public fields (no rent/deposit/owner info).
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(24, Math.max(1, parseInt(searchParams.get('limit') || '9', 10)));
        const q = (searchParams.get('q') || '').trim();
        const sort = searchParams.get('sort') || 'newest';

        // Text search across the fields a visitor would search by.
        const filter: any = {};
        if (q) {
            const rx = new RegExp(q, 'i');
            filter.$or = [
                { locality: rx },
                { bhk: rx },
                { propertyType: rx },
                { furnishing: rx },
                { availability: rx },
            ];
        }

        const sortMap: Record<string, any> = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            largest: { sqft: -1 },
            smallest: { sqft: 1 },
        };
        const sortBy = sortMap[sort] || sortMap.newest;

        const total = await Property.countDocuments(filter);
        const properties = await Property.find(filter)
            .select(PUBLIC_PROPERTY_FIELDS)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            properties,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

// POST /api/properties — admin only. Creates a new listing.
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const property = await Property.create(body);
        return NextResponse.json(property, { status: 201 });
    } catch (error: any) {
        console.error('Property Creation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 500 });
    }
}
