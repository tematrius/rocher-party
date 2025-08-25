import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','mc'], default: 'mc' },
  displayName: String,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
