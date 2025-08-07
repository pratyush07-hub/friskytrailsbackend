import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);

