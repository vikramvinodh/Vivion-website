import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 speaks the S3 API, so we use the AWS S3 SDK pointed at R2's endpoint.
// If we ever move to real S3 / Backblaze / Supabase, only these env vars change.
export const r2 = new S3Client({
    region: 'auto', // R2 ignores region but the SDK requires a value
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
});

export const R2_BUCKET = process.env.R2_BUCKET as string;

// Public base URL (custom domain connected to the bucket) used to build the
// browser-facing image URL we store in MongoDB.
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
