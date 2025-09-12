import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    productType,
    rating,
    reviews,
    offerPrice,
    actualPrice,
    description,
    productHighlights,
    productOverview,
    thingsToCarry,
    additionalInfo,
    faq,
    country,
    state,
    city,
  } = req.body;

  if (!name || !slug || !productType || !offerPrice || !actualPrice) {
    throw new ApiError(
      400,
      "Name, Slug, Product Type, Offer Price, and Actual Price are required"
    );
  }

  // Upload images to Cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result && result.secure_url) {
        images.push(result.secure_url);
      }
    }
    if (images.length > 5)
      throw new ApiError(400, "You can upload up to 5 images only");
  }

  const product = await Product.create({
    name,
    slug,
    productType,
    rating: rating || 0,
    reviews: reviews || 0,
    offerPrice,
    actualPrice,
    description,
    productHighlights,
    productOverview,
    thingsToCarry,
    additionalInfo,
    faq,
    images, // Cloudinary URLs
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
    .populate("country state city", "name slug")
    .select("name slug productType rating reviews offerPrice actualPrice images city createdAt");

  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Product By Slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug })
    .populate("country state city", "name slug")
    .select("-__v");

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ✅ Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updateData = { ...req.body };

  // Slug
  if (updateData.name) updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  if (req.files?.length) {
    updateData.images = req.files.map(f => f.path);
    if (updateData.images.length > 5) throw new ApiError(400, "You can upload up to 5 images only");
  }

  const product = await Product.findOneAndUpdate({ slug }, updateData, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// ✅ Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOneAndDelete({ slug });
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"));
});
