import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/enquiries — public. A visitor submits an enquiry for a property.
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.name?.trim() || !body.phone?.trim()) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        const enquiry = await Enquiry.create({
            name: body.name,
            phone: body.phone,
            email: body.email || '',
            message: body.message || '',
            source: body.source || 'Property Enquiry',
            propertySlug: body.propertySlug || '',
            propertyTitle: body.propertyTitle || '',
        });

        return NextResponse.json({ success: true, id: enquiry._id }, { status: 201 });
    } catch (error: any) {
        console.error('Enquiry Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to submit enquiry' }, { status: 500 });
    }
}

// GET /api/enquiries — admin only. Lists enquiries newest first.
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
        return NextResponse.json(enquiries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
    }
}
