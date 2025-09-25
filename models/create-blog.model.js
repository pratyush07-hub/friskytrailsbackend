import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    heading: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // optional: you can add block-level images later
    },
  },
  { _id: false }
);

const createBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    intro: {
      type: String,
    },
    authorName: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    coverImage: {
      type: String,
    },
    conclusion: {
      type: String,
    },
    blocks: {
      type: [contentBlockSchema],
      validate: (v) => Array.isArray(v) && v.length > 0, // must have at least one block
    },
  },
  { timestamps: true }
);

// Auto-generate slug if title is updated
createBlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export const CreateBlog =
  mongoose.models.CreateBlog || mongoose.model("CreateBlog", createBlogSchema);
