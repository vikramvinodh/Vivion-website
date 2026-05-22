import mongoose from 'mongoose';

export interface IEstimation extends mongoose.Document {
    category: string; // 'basic' | 'medium' | 'premium' | 'max'
    title: string; // e.g. "Standard Comfort"
    costPerSqFt: number; // e.g. 1600
    description: string; // e.g. "Perfect for budget-conscious home construction"
    inclusions: string[]; // list of inclusions
    updatedAt: Date;
}

const EstimationSchema = new mongoose.Schema<IEstimation>({
    category: {
        type: String,
        required: [true, 'Please provide a category tier key'],
        unique: true,
        enum: ['basic', 'medium', 'premium', 'max']
    },
    title: {
        type: String,
        required: [true, 'Please provide a tier title'],
    },
    costPerSqFt: {
        type: Number,
        required: [true, 'Please provide a cost per square foot'],
        min: [0, 'Cost must be positive']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    inclusions: {
        type: [String],
        default: []
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update the timestamp before saving
EstimationSchema.pre('save', function(this: any, next: any) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Estimation || mongoose.model<IEstimation>('Estimation', EstimationSchema);
