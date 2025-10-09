import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    thingsToCarry: {
      type: String, 
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);


productTypeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});
export const ProductType = mongoose.models.ProductType || mongoose.model("ProductType", productTypeSchema);
