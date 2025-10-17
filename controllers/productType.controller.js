import { Product } from "../models/product.model.js";
import { ProductType } from "../models/productType.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Product Type
const createProductType = asyncHandler(async (req, res) => {
  try {
    const { name, slug, thingsToCarry } = req.body; // added thingsToCarry
    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    let imageUrl = "";
    if (req.file) {
      const localPath = req.file.buffer;
      const uploadResult = await uploadOnCloudinary(localPath);
      if (!uploadResult) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResult.secure_url;
    }

    const newProductType = await ProductType.create({
      name,
      slug,
      image: imageUrl,
      thingsToCarry: thingsToCarry || "", // store it in DB
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProductType, "Product Type created successfully"));
  } catch (error) {
    console.error("Error creating product type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Product Type by Slug
const getProductTypeBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  const productType = await ProductType.findOne({ slug }).select(
    "name slug image thingsToCarry createdAt"
  ); // include thingsToCarry
  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  res
    .status(200)
    .json(new ApiResponse(200, productType, "Product Type fetched successfully"));
});

// Get Product Type with all Products
const getProductTypeBySlugWithProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  const productType = await ProductType.findOne({ slug }).select(
    "name slug image thingsToCarry createdAt"
  ); // include thingsToCarry
  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  const products = await Product.find({ productType: productType._id })
    .select("name slug image price description createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      { productType, products },
      "Product Type with products fetched successfully"
    )
  );
});

// Get All Product Types
const getAllProductTypes = asyncHandler(async (req, res) => {
  try {
    const productTypes = await ProductType.find().select(
      "name slug image thingsToCarry createdAt"
    ); // include thingsToCarry
    res
      .status(200)
      .json(new ApiResponse(200, productTypes, "Product Types fetched successfully"));
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get Product Type by ID
const getProductTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  // Find the product type by _id
  const productType = await ProductType.findById(id).select(
    "name slug image thingsToCarry createdAt"
  );

  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  res
    .status(200)
    .json(new ApiResponse(200, productType, "Product Type fetched successfully"));
});


export { createProductType, getProductTypeBySlug, getProductTypeBySlugWithProduct, getAllProductTypes, getProductTypeById };
