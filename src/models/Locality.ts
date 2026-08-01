import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * A Bangalore locality that gets its own landing page.
 *
 * This exists so localities are a controlled vocabulary rather than whatever
 * text someone types into the property form — free text would mean "BTM Layout"
 * and "btm layout" each generating their own (competing, half-empty) page.
 *
 * It's also the only place with room for the editorial copy that makes a
 * locality page rank; a bare list of listings is thin content.
 */
export interface ILocality extends mongoose.Document {
    name: string; // e.g. "BTM Layout"
    slug: string; // e.g. "btm-layout" — the URL segment
    about: string; // HTML — connectivity, landmarks, who lives there
    metaTitle: string; // optional override for the <title>
    metaDescription: string; // optional override for the meta description
    heroImage: string;
    active: boolean; // unpublished localities are excluded from the site + sitemap
    createdAt: Date;
}

const LocalitySchema = new mongoose.Schema<ILocality>({
    name: { type: String, required: [true, 'Locality name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    about: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    // Off by default: a locality with no inventory and no copy is a thin page,
    // so it stays out of the sitemap until someone deliberately publishes it.
    active: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

LocalitySchema.pre('save', function (this: ILocality) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
});

export default mongoose.models.Locality ||
    mongoose.model<ILocality>('Locality', LocalitySchema);
