import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin';
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[]; // ref to Product
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
