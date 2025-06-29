import { Request, Response } from "express";
import { productSchemaValidation } from "./products.validation";
import { ZodError } from "zod";
import { productService } from "./prodcuts.service";
import Bike from "./products.model";
import { sendImageToCloudinary } from "../../../utils/cloudinary";
import multer from "multer";
import User from "../users/user.model";
import mongoose from "mongoose";
export const upload = multer({ storage: multer.memoryStorage() });

const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Image file is missing" });
    }

    // Upload image to Cloudinary
    const result: any = await sendImageToCloudinary(
      req.file.originalname,
      req.file.buffer
    );

    const newProduct = {
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      category: req.body.category,
      inStock: req.body.inStock === "true",
      image: result.secure_url,
    };
    const savedProduct = await productService.createProductsInDb(newProduct);
    return res
      .status(201)
      .json({ status: true, message: "Product created", data: savedProduct });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res
      .status(500)
      .json({ status: false, error: "Image upload failed" });
  }
};
const getProducts = async (req: Request, res: Response) => {
  let query: any = { isDeleted: false };

  if (req?.query?.searchTerm) {
    query.$or = [
      { name: { $regex: req.query.searchTerm, $options: "i" } },
      { brand: { $regex: req.query.searchTerm, $options: "i" } },
      { category: { $regex: req.query.searchTerm, $options: "i" } },
    ];
  }

  // console.log(req.query, "query");
  if (req.query.category && req.query.category !== "") {
    query.category = req.query.category;
  }

  // console.log(req.query, "query");
  // handle price ranges
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {
      ...(req.query.minPrice ? { $gte: Number(req.query.minPrice) } : {}),
      ...(req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : {}),
    };
  }
  const sortOrder = req.query.sortBy === "1" ? 1 : -1;
  const sortBy = { createdAt: sortOrder };
  //handle paginations
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 3;
  const allLists = await Bike.countDocuments({ isDeleted: false });
  const skip = (page - 1) * limit;
  // console.log(query, "query");
  try {
    const result = await productService.getProductDataFromDb({
      searchQuery: query,
      page,
      limit,
      skip,
      sortBy,
    });
    // console.log("Final Mongo query:", JSON.stringify(query, null, 2));

    if (result?.data.length < 1) {
      res.status(200).json({
        message: "No Bike Found",
        status: false,
      });
    } else {
      res.status(200).json({
        message: "Bikes retrieved successfully",
        status: true,
        data: result,
        total: result?.totalCount,
        currentPage: page,
        allLists,
        totalPages: Math.ceil(result?.totalCount / limit),
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Something Went Wrong",
      status: false,
      error: error,
      stack: error?.stack || "No stack Error",
    });
  }
};
const getProductsById = async (req: Request, res: Response) => {
  try {
    const result = await productService.getroductByIdFromDb(
      req.params.productId
    );
    res.status(200).json({
      message: "Bike retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: false,
      error: error,
      stack: error?.stack,
    });
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.deleteProductFromDb(
      req.params.productId
    );
    res.status(200).json({
      message: "Bike deleted successfully",
      status: true,
      data: [],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: false,
      error: error,
      stack: error?.stack || "No stack Error",
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    let updateData = { ...req.body };

    // If a new image is uploaded
    if (req.file) {
      const result: any = await sendImageToCloudinary(
        req.file.originalname,
        req.file.buffer
      );
      updateData.image = result.secure_url;
    }
    if (updateData.quantity !== undefined) {
      updateData.quantity = Number(updateData.quantity);
      updateData.isStock = updateData.quantity > 0;
    }

    const updatedProduct = await productService.updateProductInDb(
      productId,
      updateData
    );

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: false,
      message: "Product update failed",
      error: error.message,
    });
  }
};
const softDeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Bike.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product soft deleted successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Soft Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addOrUpdateReview = async (req: Request, res: Response) => {
  // // Add or update review logic here
  // console.log(req.body, "req.body");
  // console.log(req.params.productId, "productId");
  const { userId, rating, text } = req.body;
  const productId = req.params.productId;
  const user = await User.findById(userId);
  if (!user || user?.role === "admin") {
    return res.status(404).json({ message: "You Can not Give review" });
  }
  const product = await Bike.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  //already review.
  const reviewExists =
    product?.reviews &&
    product.reviews.find((review) => review?.user.toString() === userId);
  if (reviewExists) {
    reviewExists.rating = rating;
    reviewExists.text = text;
    await product.save();
    return res.status(200).json({ message: "Review updated successfully" });
  }
  product && product.reviews.push({ user: userId, rating, text });

  //calculate average
  const totalRating = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  product.averageRating = totalRating / product?.reviews.length;
  await product.save();
  console.log(product);
  return res
    .status(200)
    .json({ message: "Review added successfully", success: true, product });
};
export const productController = {
  createProduct,
  getProducts,
  getProductsById,
  deleteProduct,
  updateProduct,
  softDeleteProduct,
  addOrUpdateReview,
};
