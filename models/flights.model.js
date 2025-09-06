import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromCity: {
      type: String,
      required: true,
    },
    toCity: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    travelClass: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business", "First"],
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    airline: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
    }
  },
  { timestamps: true }
);

export const Flight = mongoose.model("Flight", flightSchema);
