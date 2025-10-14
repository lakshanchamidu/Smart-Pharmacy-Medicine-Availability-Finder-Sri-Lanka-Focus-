import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    stock: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

inventorySchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

export const Inventory = mongoose.model('Inventory', inventorySchema);
