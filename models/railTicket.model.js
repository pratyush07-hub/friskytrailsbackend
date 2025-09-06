import mongoose from "mongoose";

const railTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromStation: {
      type: String,
      required: true,
    },
    toStation: {
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
      enum: ["Sleeper", "AC", "General"],
      required: true,
    },
    passengers: {
      type: Number,
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

export const RailTicket = mongoose.model("RailTicket", railTicketSchema);
