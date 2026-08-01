import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property, { PUBLIC_PROPERTY_FIELDS } from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/properties/[slug] — public detail (public fields only).
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const property = await Property.findOne({ slug }).select(PUBLIC_PROPERTY_FIELDS);

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        return NextResponse.json(property);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

// PUT /api/properties/[slug] — admin update.
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const property = await Property.findOne({ slug });
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Assign fields then save() so the slug pre-save hook can run if locality changed.
        Object.assign(property, body);
        await property.save();

        return NextResponse.json(property);
    } catch (error: any) {
        console.error('Property Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
    }
}

// DELETE /api/properties/[slug] — admin delete.
export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const deleted = await Property.findOneAndDelete({ slug });

        if (!deleted) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete property' }, { status: 500 });
    }
}
