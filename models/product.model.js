import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    images: {
      type: [String], 
      validate: {
        validator: function (val) {
          return val.length <= 5; 
        },
        message: "You can upload up to 5 images only.",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  },
  { timestamps: true }
);

// Auto-generate slug before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
