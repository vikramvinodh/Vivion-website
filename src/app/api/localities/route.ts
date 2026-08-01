import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/localities?all=1
// Returns published localities with their live property counts. The admin
// panel passes ?all=1 (authenticated) to include unpublished ones too.
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        let includeInactive = false;
        if (searchParams.get('all') === '1') {
            const session = await getServerSession(authOptions);
            includeInactive = Boolean(session?.user);
        }

        const localities = await Locality.find(includeInactive ? {} : { active: true })
            .sort({ name: 1 })
            .lean();

        // One grouped count instead of a query per locality.
        const counts = await Property.aggregate<{ _id: string; count: number }>([
            { $group: { _id: '$localitySlug', count: { $sum: 1 } } },
        ]);
        const countBySlug = new Map(counts.map((c) => [c._id, c.count]));

        return NextResponse.json({
            localities: localities.map((locality: any) => ({
                ...locality,
                propertyCount: countBySlug.get(locality.slug) || 0,
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch localities' }, { status: 500 });
    }
}

// POST /api/localities — admin only.
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const locality = await Locality.create(body);
        return NextResponse.json(locality, { status: 201 });
    } catch (error: any) {
        // A duplicate slug means the locality already exists — say so plainly
        // rather than surfacing Mongo's E11000.
        if (error?.code === 11000) {
            return NextResponse.json({ error: 'A locality with that name already exists.' }, { status: 409 });
        }
        console.error('Locality Creation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create locality' }, { status: 500 });
    }
}
