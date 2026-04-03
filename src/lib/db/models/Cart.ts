import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId; // Optional: can be anonymous session cart initially
  sessionId?: string; // For unauthenticated users
  items: {
    inventory: mongoose.Types.ObjectId; // Refers to the specific variant
    quantity: number;
  }[];
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, index: true },
    items: [
      {
        inventory: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
