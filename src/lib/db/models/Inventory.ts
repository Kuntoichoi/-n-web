import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Compound index to ensure unique variants per product
InventorySchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
