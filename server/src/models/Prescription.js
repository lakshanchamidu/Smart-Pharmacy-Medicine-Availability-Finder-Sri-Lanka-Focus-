import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: String,
    type: { type: String, enum: ['image', 'pdf'] },
    size: Number,
    storage: { type: String, enum: ['LOCAL', 'S3', 'CLOUDINARY'], default: 'LOCAL' }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    files: [fileSchema],
    note: String,
    status: { type: String, enum: ['submitted', 'under_review', 'approved_with_quote', 'rejected', 'cancelled'], default: 'submitted' },
    quote: {
      items: [
        {
          medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
          name: String,
          qty: Number,
          price: Number
        }
      ],
      total: Number,
      currency: { type: String, default: 'LKR' },
      reservationExpiresAt: Date
    },
    verification: {
      isValid: Boolean,
      reason: String,
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    }
  },
  { timestamps: true }
);

prescriptionSchema.index({ pharmacyId: 1, status: 1, createdAt: -1 });
prescriptionSchema.index({ userId: 1, createdAt: -1 });

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
