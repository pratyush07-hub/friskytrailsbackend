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
      if (result?.secure_url) images.push(result.secure_url);
    }
    if (images.length > 5)
      throw new ApiError(400, "You can upload up to 5 images only");
  }

  // Helper: clean optional ObjectId fields
  const cleanObjectId = (value) => (value ? value : undefined);

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
    country, // required
    state: cleanObjectId(state), // optional
    city: cleanObjectId(city),   // optional
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
// ✅ Get Product By ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Fetching product with ID:", id);
  const product = await Product.findById(id)
    .populate("country state city", "name slug")
    .select("-__v");
  console.log("Fetched product:", product);

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});


// Update product by slug
export const updateProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const {
    name,
    offerPrice,
    actualPrice,
    productType,
    rating,
    reviews,
    productHighlights,
    productOverview,
    additionalInfo,
    faq,
    country,
    state,
    city,
  } = req.body;

  // Find existing product
  const product = await Product.findOne({ slug });
  if (!product) throw new ApiError(404, "Product not found");

  // Update cover images if new files uploaded
  if (req.files?.length) {
    if (req.files.length + product.images.length > 5)
      throw new ApiError(400, "You can upload up to 5 images only");

    // Upload new images to cloudinary
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.secure_url) uploadedImages.push(result.secure_url);
    }

    product.images = [...product.images, ...uploadedImages];
  }

  // Update fields
  if (name) {
    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true });
  }
  if (offerPrice) product.offerPrice = offerPrice;
  if (actualPrice) product.actualPrice = actualPrice;
  if (productType) product.productType = productType;
  if (rating) product.rating = rating;
  if (reviews) product.reviews = reviews;
  if (productHighlights) product.productHighlights = productHighlights;
  if (productOverview) product.productOverview = productOverview;
  if (additionalInfo) product.additionalInfo = additionalInfo;
  if (faq) product.faq = faq;
  if (country) product.country = country;
  if (state) product.state = state;
  if (city) product.city = city;

  // Save
  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


// ✅ Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOneAndDelete({ slug });
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"));
});
