import { CreateBlog } from "../models/create-blog.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
    try {
    const { title, content, slug, authorName } = req.body;

    if (!title || !content || !slug || !authorName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = "";

    if (req.file) {
      const localPath = req.file.path;

      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }

      imageUrl = uploadResult.secure_url;
      console.log(imageUrl);

    }

    const newBlog = await CreateBlog.create({
      title,
      slug,
      content,
      image: imageUrl,
      authorName,
    });
    await newBlog.save();

    res.status(201).json(new ApiResponse(201, newBlog, "Blog created successfully"));
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

export { createBlog }