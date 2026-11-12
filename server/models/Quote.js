import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, match: /^[6-9]\d{9}$/ },
    pickup: { type: String, required: true, trim: true, maxlength: 120 },
    drop: { type: String, required: true, trim: true, maxlength: 120 },
    goods: { type: String, trim: true, maxlength: 120 },
    vehicle: { type: String, trim: true, maxlength: 60 },
    date: { type: String, trim: true, maxlength: 20 },
    message: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Quote', quoteSchema);
