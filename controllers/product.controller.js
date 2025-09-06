import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";

// ✅ Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, country, state, city } = req.body;

  if (!name || !slug || !price) {
    throw new ApiError(400, "Name, Slug, and Price are required");
  }

  // Handle multiple images
  const images = req.files ? req.files.map((file) => file.path) : [];

  if (images.length > 5) {
    throw new ApiError(400, "You can upload up to 5 images only");
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    images,
    country,
    state,
    city,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "✅ Product created successfully"));
});

// ✅ Get All Products
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("city", "name slug state country")
    .select("name slug description images price city createdAt");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Product By Slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate("city", "name slug state country")
    .select("name slug description images price city createdAt");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ✅ Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, description, price, city, newSlug } = req.body;

  const updateData = { name, description, price, city };

  // Slug update
  if (newSlug) {
    updateData.slug = slugify(newSlug, { lower: true, strict: true });
  } else if (name) {
    updateData.slug = slugify(name, { lower: true, strict: true });
  }

  // If new images uploaded, replace existing ones
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((file) => file.path);

    if (updateData.images.length > 5) {
      throw new ApiError(400, "You can upload up to 5 images only");
    }
  }

  const product = await Product.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ✅ Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOneAndDelete({ slug });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});
