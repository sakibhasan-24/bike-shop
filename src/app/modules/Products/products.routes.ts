import express from "express";
import { productController } from "./products.controller";
const router = express.Router();
router.post("/products", productController.createProduct);
export const bikeRoutes = router;
