import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromLocation: {
      type: String,
      required: true,
    },
    toLocation: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    transportType: {
      type: String,
      enum: ["Bus", "Train", "Flight", "Other"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
    },
    bookingReference: {
      type: String,
      unique: true,
    }
  },
  { timestamps: true }
);

export const Transport = mongoose.model("Transport", transportSchema);
