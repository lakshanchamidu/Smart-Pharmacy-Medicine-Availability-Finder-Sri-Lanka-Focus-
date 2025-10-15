import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['customer', 'pharmacy', 'admin'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, validate: [validator.isEmail, 'Invalid email'] },
    phone: { type: String },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
