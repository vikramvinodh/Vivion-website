import mongoose from 'mongoose';
import slugify from 'slugify';

const PostSchema = new mongoose.Schema({
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
PostSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next();
        return;
    }
    this.slug = slugify(this.title, { lower: true });
    next();
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
