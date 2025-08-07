import mongoose from "mongoose";

const adventureSchema = new mongoose.Schema(
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
    duration: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Adventure = mongoose.model("Adventure", adventureSchema);
