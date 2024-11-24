import { Request, Response } from "express";
import { productSchemaValidation } from "./products.validation";
import { ZodError } from "zod";
import { productService } from "./prodcuts.service";
import Bike from "./products.model";

const createProduct = async (req: Request, res: Response) => {
  const bikeData = req.body;
  try {
    const bikeValidateData = productSchemaValidation.parse(bikeData);
    console.log(bikeValidateData, "jod");
    const result = await productService.createProductsInDb(bikeValidateData);
    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(500).json({
        message: "Validation Failed",
        status: false,
        error: error,
        stack: error?.stack,
      });
    } else {
      res.status(500).json({
        message: "Validation Failed",
        status: false,
        error: error,
        stack: error?.stack,
      });
    }
  }
};
const getProducts = async (req: Request, res: Response) => {
  let query = {};

  if (req.query.searchTerm) {
    query = {
      $or: [
        { name: { $regex: req.query.searchTerm, $options: "i" } },
        { brand: { $regex: req.query.searchTerm, $options: "i" } },
        { category: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    };
  }
  //   console.log(req.query, "query");

  try {
    const result = await productService.getProductDataFromDb(query);
    if (result?.length < 1) {
      res.status(200).json({
        message: "No Bike Found",
        status: false,
      });
    } else {
      res.status(200).json({
        message: "Bikes retrieved successfully",
        status: true,
        data: result,
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
export const productController = {
  createProduct,
  getProducts,
  getProductsById,
  deleteProduct,
};
