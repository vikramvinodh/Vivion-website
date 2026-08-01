import mongoose from 'mongoose';
import slugify from 'slugify';

export interface IProperty extends mongoose.Document {
    // --- Private (admin-only, never exposed on the public site) ---
    ownerName: string;
    ownerNumber: string;
    rent: number;
    maintenance: number;
    deposit: string; // e.g. "8 months"

    // --- Public listing info ---
    bhk: string; // e.g. "2 BHK"
    sqft: number;
    facing: string; // e.g. "North"
    propertyType: string; // e.g. "Apartment"
    locality: string; // e.g. "BTM Layout" — display name, matches a Locality.name
    localitySlug: string; // e.g. "btm-layout" — derived; joins to Locality.slug
    bathrooms: number;
    availableFloor: string; // e.g. "2nd Floor"
    lift: boolean;
    powerBackup: boolean;
    petsFriendly: boolean;
    furnishing: string; // e.g. "Semi Furnished"
    religionRestrictions: string; // e.g. "Hindu and Christian"
    eatingHabits: string; // e.g. "Both"
    parking: string; // e.g. "Yes, inside"
    availability: string; // e.g. "Ready to move"

    // --- Media ---
    coverImage: string;
    images: string[];

    slug: string;
    createdAt: Date;
}

// Fields that are safe to send to the public website / API.
// Anything not listed here (rent, maintenance, deposit, owner details) stays private.
export const PUBLIC_PROPERTY_FIELDS =
    'bhk sqft facing propertyType locality localitySlug bathrooms availableFloor lift powerBackup ' +
    'petsFriendly furnishing religionRestrictions eatingHabits parking availability ' +
    'coverImage images slug createdAt';

const PropertySchema = new mongoose.Schema<IProperty>({
    // Private
    ownerName: { type: String, required: [true, 'Owner name is required'] },
    ownerNumber: { type: String, required: [true, 'Owner number is required'] },
    rent: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    deposit: { type: String, default: '' },

    // Public
    bhk: { type: String, required: [true, 'BHK is required'] },
    sqft: { type: Number, required: [true, 'Square footage is required'] },
    facing: { type: String, default: '' },
    propertyType: { type: String, default: 'Apartment' },
    locality: { type: String, required: [true, 'Locality is required'], trim: true },
    localitySlug: { type: String, default: '', index: true },
    bathrooms: { type: Number, default: 1 },
    availableFloor: { type: String, default: '' },
    lift: { type: Boolean, default: false },
    powerBackup: { type: Boolean, default: false },
    petsFriendly: { type: Boolean, default: false },
    furnishing: { type: String, default: '' },
    religionRestrictions: { type: String, default: '' },
    eatingHabits: { type: String, default: '' },
    parking: { type: String, default: '' },
    availability: { type: String, default: 'Ready to move' },

    // Media
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },

    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

// Build a readable, unique slug from the locality + a short id suffix, so
// multiple listings in the same locality don't collide.
// e.g. "BTM Layout" -> "btm-layout-a3f9c2"
PropertySchema.pre('save', function (this: IProperty) {
    if (this.isModified('locality') || !this.slug) {
        const base = slugify(`${this.locality} ${this.bhk}`, { lower: true, strict: true });
        this.slug = `${base}-${this._id.toString().slice(-6)}`;
    }

    // Derived rather than sent by the client, so it can never drift from the
    // display name. Locality.slug is built with the same call, so this is the
    // join key to the matching Locality document.
    if (this.isModified('locality') || !this.localitySlug) {
        this.localitySlug = slugify(this.locality, { lower: true, strict: true });
    }
});

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
