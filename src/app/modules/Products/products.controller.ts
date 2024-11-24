import { Request, Response } from "express";
import { productSchemaValidation } from "./products.validation";
import { ZodError } from "zod";
import { productService } from "./prodcuts.service";

const createProduct = async (req: Request, res: Response) => {
  const bikeData = req.body;
  try {
    const bikeValidateData = productSchemaValidation.parse(bikeData);
    console.log(bikeValidateData, "jod");
    const result = await productService.createProductsInDb(bikeValidateData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(500).json({
        message: "Validation Failed",
        success: false,
        error: error,
        stack: error?.stack,
      });
    } else {
      res.status(500).json({
        message: "Validation Failed",
        success: false,
        error: error,
        stack: error?.stack,
      });
    }
  }
};
export const productController = {
  createProduct,
};
