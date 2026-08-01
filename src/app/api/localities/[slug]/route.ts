import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/localities/[slug] — public detail.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const locality = await Locality.findOne({ slug });

        if (!locality) {
            return NextResponse.json({ error: 'Locality not found' }, { status: 404 });
        }
        return NextResponse.json(locality);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch locality' }, { status: 500 });
    }
}

// PUT /api/localities/[slug] — admin update.
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const locality = await Locality.findOne({ slug });
        if (!locality) {
            return NextResponse.json({ error: 'Locality not found' }, { status: 404 });
        }

        const previousSlug = locality.slug;
        const previousName = locality.name;
        Object.assign(locality, body);
        await locality.save(); // pre-save re-derives the slug if the name changed

        // Renaming changes the slug, which would orphan every property still
        // pointing at the old one. Carry them across so the join key holds.
        // A casing-only rename ("btm layout" → "BTM Layout") keeps the slug but
        // still needs the display string propagated.
        if (locality.slug !== previousSlug || locality.name !== previousName) {
            await Property.updateMany(
                { localitySlug: previousSlug },
                { $set: { locality: locality.name, localitySlug: locality.slug } },
            );
        }

        return NextResponse.json(locality);
    } catch (error: any) {
        if (error?.code === 11000) {
            return NextResponse.json({ error: 'A locality with that name already exists.' }, { status: 409 });
        }
        console.error('Locality Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update locality' }, { status: 500 });
    }
}

// DELETE /api/localities/[slug] — admin delete, blocked while listings use it.
export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;

        // Deleting a locality out from under live listings would leave them
        // with a dangling localitySlug and no landing page to link back to.
        const inUse = await Property.countDocuments({ localitySlug: slug });
        if (inUse > 0) {
            return NextResponse.json(
                {
                    error: `${inUse} propert${inUse === 1 ? 'y is' : 'ies are'} still listed in this locality. Reassign or delete ${inUse === 1 ? 'it' : 'them'} first.`,
                },
                { status: 409 },
            );
        }

        const deleted = await Locality.findOneAndDelete({ slug });
        if (!deleted) {
            return NextResponse.json({ error: 'Locality not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete locality' }, { status: 500 });
    }
}
