import mongoose from 'mongoose';

export interface IEnquiry extends mongoose.Document {
    name: string;
    phone: string;
    email: string;
    message: string;
    source: string; // where the lead came from, e.g. "Property Enquiry", "Get a Quote", "Book Consultation"
    propertySlug: string;
    propertyTitle: string;
    status: 'new' | 'contacted' | 'closed';
    createdAt: Date;
}

const EnquirySchema = new mongoose.Schema<IEnquiry>({
    name: { type: String, required: [true, 'Name is required'] },
    phone: { type: String, required: [true, 'Phone is required'] },
    email: { type: String, default: '' },
    message: { type: String, default: '' },
    source: { type: String, default: 'Property Enquiry' },
    propertySlug: { type: String, default: '' },
    propertyTitle: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
