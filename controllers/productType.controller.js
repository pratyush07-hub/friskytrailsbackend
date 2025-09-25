import { Product } from "../models/product.model.js";
import { ProductType } from "../models/productType.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProductType = asyncHandler(async (req, res) => {
    try{
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
        const newProductType = await ProductType.create({
            name,
            slug,
            image: imageUrl,
        });
        res
        .status(201)
        .json(new ApiResponse(201, newProductType, "Product Type created successfully"));
    } catch (error) {
        console.error("Error creating product type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

const getProductTypeBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
    }
    const productType = await ProductType.findOne({ slug }).select("name slug image createdAt");
    if (!productType) {
        return res.status(404).json({ message: "Product Type not found" });
    }
    res
    .status(200)
    .json(new ApiResponse(200, productType, "Product Type fetched successfully"));
});

const getProductTypeBySlugWithProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  // Find the product type
  const productType = await ProductType.findOne({ slug }).select("name slug image createdAt");
  if (!productType) {
    return res.status(404).json({ message: "Product Type not found" });
  }

  // Find all products linked to this product type
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

const getAllProductTypes = asyncHandler(async (req, res) => {
  try {
    const productTypes = await ProductType.find().select("name slug image createdAt");
    res
      .status(200)
      .json(new ApiResponse(200, productTypes, "Product Types fetched successfully"));
  }
    catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export { createProductType, getProductTypeBySlug, getProductTypeBySlugWithProduct, getAllProductTypes };