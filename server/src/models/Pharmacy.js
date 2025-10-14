import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere', required: true }
    },
    phone: { type: String },
    openingHours: { type: String },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

pharmacySchema.index({ 'location': '2dsphere' });

export const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
