import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    productType: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    offerPrice: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    productHighlights: { type: String },
    productOverview: { type: String },

    additionalInfo: { type: String },
    faq: { type: String },
    images: {
      type: [String],
      validate: {
        validator: (val) => val.length <= 5,
        message: "You can upload up to 5 images only.",
      },
    },
  },
  { timestamps: true }
);

// Auto-generate slug
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
