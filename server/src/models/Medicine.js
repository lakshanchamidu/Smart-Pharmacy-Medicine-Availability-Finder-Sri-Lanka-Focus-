import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genericName: { type: String },
    brand: { type: String },
    category: { type: String },
    form: { type: String },
    strength: { type: String }
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', genericName: 'text', brand: 'text' });

export const Medicine = mongoose.model('Medicine', medicineSchema);
