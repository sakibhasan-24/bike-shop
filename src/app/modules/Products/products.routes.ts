import express from "express";
import { productController } from "./products.controller";
const router = express.Router();
router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:productId", productController.getProductsById);
router.delete("/products/:productId", productController.deleteProduct);
router.put("/products/:productId", productController.updateProduct);
export const bikeRoutes = router;
