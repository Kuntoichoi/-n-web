import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number; // Only applicable if discountType is 'percent'
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, min: 0 },
    maxDiscountValue: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
