import mongoose from "mongoose";

const createBlogSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
    },
    image: {
      type: String,
    },
    authorName:{
        type: String,
        required: true,
    },
}, {timestamps: true})

createBlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});


export const CreateBlog = mongoose.model("CreateBlog", createBlogSchema)