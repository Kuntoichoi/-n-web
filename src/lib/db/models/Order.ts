import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId; // Snapshot ref
    inventoryInfo: { size: string; color: string; sku: string }; 
    quantity: number;
    priceAtPurchase: number;
  }[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'COD' | 'Gateway';
  paymentStatus: 'pending' | 'paid' | 'failed';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponApplied?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        inventoryInfo: {
          size: { type: String, required: true },
          color: { type: String, required: true },
          sku: { type: String, required: true },
        },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['COD', 'Gateway'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponApplied: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  },
  { timestamps: true }
);

// Index for order lookups and admin dashboard
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
