import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    items: [
      {
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
        qty: { type: Number, required: true },
        priceAtReserve: { type: Number, required: true }
      }
    ],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'expired', 'picked_up'], default: 'pending' },
    expiresAt: { type: Date },
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }
  },
  { timestamps: true }
);

reservationSchema.index({ userId: 1, status: 1, expiresAt: 1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
