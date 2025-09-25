import { Country } from "../models/country.model.js";
import { CreateBlog } from "../models/create-blog.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, slug, authorName, country, state, city, blocks } = req.body;

    // Validate required fields
    if (!title || !slug || !authorName || !country || !state || !city || !blocks) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse blocks if sent as string (form-data)
    let parsedBlocks = blocks;
    if (typeof blocks === "string") {
      try {
        parsedBlocks = JSON.parse(blocks);
      } catch (err) {
        return res.status(400).json({ message: "Invalid blocks format" });
      }
    }

    if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) {
      return res.status(400).json({ message: "At least one content block is required" });
    }

    // Handle optional cover image upload
    let coverImageUrl = "";
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      coverImageUrl = uploadResult?.secure_url || "";
    }

    // Normalize blocks
    const updatedBlocks = parsedBlocks.map((block, idx) => ({
      order: Number(block.order) || idx + 1, // fallback: use array index
      intro: block.intro || "",
      content: block.content || "",
      image: block.image || "",
    }));

    // Create blog
    const newBlog = await CreateBlog.create({
      title,
      slug,
      authorName,
      country,
      state,
      city,
      coverImage: coverImageUrl,
      blocks: updatedBlocks,
    });

    res.status(201).json({
      status: true,
      data: newBlog,
      message: "✅ Blog created successfully",
    });
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
    if (!slug) return res.status(400).json({ status: false, message: "Slug parameter is required" });

    const blog = await CreateBlog.findOne({ slug })
      .populate("country", "name slug")
      .populate("state", "name slug")
      .populate("city", "name slug")
      .lean();

    if (!blog) return res.status(404).json({ status: false, message: "Blog not found" });

    if (blog.blocks && blog.blocks.length > 0) {
      blog.blocks.sort((a, b) => a.order - b.order);
    }

    res.status(200).json({ status: true, data: blog, message: "Blog fetched successfully" });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};



// Upload single image from rich text editor
const uploadEditorImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult?.secure_url) {
      return res.status(500).json({ status: false, message: "Image upload failed" });
    }
    return res.status(201).json({ status: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error("Editor image upload error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

export { createBlog, createCountry, getCountryWithBlogs, getCountries, getBlogBySlug, uploadEditorImage };
