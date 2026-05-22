import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOne({ slug }).populate('author', 'name');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { slug } = await params;

        // In a real app, you might want to check if the user is the author or admin
        // For now, any authenticated user can edit (assuming only admins have accounts)

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (body.title !== undefined) post.title = body.title;
        if (body.content !== undefined) post.content = body.content;
        if (body.excerpt !== undefined) post.excerpt = body.excerpt;
        if (body.coverImage !== undefined) post.coverImage = body.coverImage;
        if (body.published !== undefined) post.published = body.published;

        await post.save();

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOneAndDelete({ slug });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
