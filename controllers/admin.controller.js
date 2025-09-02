import { Country } from "../models/country.model.js";
import { CreateBlog } from "../models/create-blog.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      slug,
      intro,
      content,
      authorName,
      country,
      state,
      city,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content || !authorName || !country || !state || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      const localPath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResult.secure_url;
    }

    // Create the blog
    const newBlog = await CreateBlog.create({
      title,
      slug,
      intro,
      content,
      image: imageUrl,
      authorName,
      country,
      state,
      city,
    });

    res.status(201).json(new ApiResponse(201, newBlog, "Blog created successfully"));
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const createCountry = asyncHandler(async (req, res) => {
  try {
    const { name, slug } = req.body;

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

    const newCountry = await Country.create({
      name,
      slug,
      image: imageUrl,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newCountry, "Country created successfully"));
  } catch (error) {
    console.error("Error creating country:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCountries = asyncHandler(async (req, res) => {
  try {
    const countries = await Country.find().select("name slug image createdAt");

    res
      .status(200)
      .json(new ApiResponse(200, countries, "Countries fetched successfully"));
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getCountryBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new ApiError(400, "Slug is required");
    }

    const country = await Country.findOne({ slug }).select("name slug image createdAt");

    if (!country) {
      throw new ApiError(404, "Country not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, country, "Country fetched successfully"));
  } catch (error) {
    console.error("Error fetching country by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCountryWithBlogs = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const country = await Country.findOne({ slug }).select("name slug image");
  if (!country) {
    throw new ApiError(404, "Country not found");
  }

  const blogs = await CreateBlog.find({ country: country._id })
    .populate("state", "name slug")
    .populate("city", "name slug")
    .select("title slug image content authorName state city createdAt");

  res
    .status(200)
    .json(new ApiResponse(200, { country, blogs }, "Country with blogs fetched successfully"));
});


const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await CreateBlog.findOne({ slug })
      .populate("country", "name slug") 
      .populate("state", "name slug")
      .populate("city", "name slug");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(
      new ApiResponse(200, blog, "Blog fetched successfully")
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export { createBlog, createCountry, getCountryWithBlogs, getCountries, getBlogBySlug };
