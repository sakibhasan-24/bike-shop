import express from "express";
import { productController } from "./products.controller";
const router = express.Router();
router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:productId", productController.getProductsById);
router.delete("/products/:productId", productController.deleteProduct);
export const bikeRoutes = router;
