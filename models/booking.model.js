import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, 
  },
  date: {
    type: Date,
    required: true,
  },
  guest: {
    type: Number,
    required: true,
    min: 1,
  },
  message: {
    type: String,
    trim: true,
    default: "",
  },
  productSlug: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
