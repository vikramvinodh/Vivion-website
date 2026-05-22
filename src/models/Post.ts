import mongoose from 'mongoose';
import slugify from 'slugify';
import './User';

export interface IPost extends mongoose.Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: mongoose.Schema.Types.ObjectId;
    published: boolean;
    createdAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    coverImage: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create slug from title before saving
PostSchema.pre('save', function (this: IPost) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
