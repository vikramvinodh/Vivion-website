import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export async function POST(request: Request) {
    try {
        // Only logged-in admins can upload — same guard as the posts route.
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        if (!ALLOWED.includes(file.type)) {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File is larger than 5MB' }, { status: 400 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());

        // Unique key: keep the extension, prefix by date for easy browsing.
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const key = `uploads/${new Date().getFullYear()}/${randomUUID()}.${ext}`;

        await r2.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
                Body: bytes,
                ContentType: file.type,
                CacheControl: 'public, max-age=31536000, immutable',
            })
        );

        const url = `${R2_PUBLIC_URL}/${key}`;
        return NextResponse.json({ url }, { status: 201 });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
