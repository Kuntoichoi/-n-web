import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  status: 'active' | 'draft' | 'archived';
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    status: { 
      type: String, 
      enum: ['active', 'draft', 'archived'], 
      default: 'draft' 
    },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

// Full-text search index for catalog search
ProductSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
