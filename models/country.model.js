import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

countrySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});
export const Country = mongoose.models.Country || mongoose.model("Country", countrySchema);