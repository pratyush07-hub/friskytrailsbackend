import { CreateBlog } from "../models/create-blog.model.js";
import { Location } from "../models/location.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, slug, authorName, location } = req.body;

    if (!title || !content || !slug || !authorName || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = "";

    // Upload image if provided
    if (req.file) {
      const localPath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResult.secure_url;
    }

    const newBlog = await CreateBlog.create({
      title,
      slug,
      content,
      image: imageUrl,
      authorName,
      location,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newBlog, "Blog created successfully"));
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const createLocation = asyncHandler(async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    let imageUrl = "";

    if (req.file) {
      const localPath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResult.secure_url;
    }

    const newLocation = await Location.create({
      name,
      slug,
      description,
      image: imageUrl,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newLocation, "Location created successfully"));
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getLocations = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.find().select("name slug image description createdAt");

    res
      .status(200)
      .json(new ApiResponse(200, locations, "Locations fetched successfully"));
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const getLocationWithBlogs = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const location = await Location.findOne({ slug });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    const blogs = await CreateBlog.find({ location: location._id }).select(
      "title slug image authorName createdAt"
    );

    res
      .status(200)
      .json(new ApiResponse(200, { location, blogs }, "Location details fetched"));
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await CreateBlog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createBlog, createLocation, getLocationWithBlogs, getLocations, getBlogBySlug };
