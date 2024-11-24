import express from "express";
import { productController } from "./products.controller";
const router = express.Router();
router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
export const bikeRoutes = router;
