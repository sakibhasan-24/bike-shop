// @ts-nocheck
import express from "express";
import { productController, upload } from "./products.controller";
import { verifyToken } from "../../../utils/verifyToken";
import { verifyAdmin } from "../../../utils/verifyAdmin";
const router = express.Router();
router.post(
  "/products",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  productController.createProduct
);
router.get("/products", productController.getProducts);
router.get("/products/:productId", productController.getProductsById);
router.patch("/products/:id", productController.softDeleteProduct);
router.put(
  "/products/:productId",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  productController.updateProduct
);
router.put(
  "/add-review/:productId",
  verifyToken,
  productController.addOrUpdateReview
);
export const bikeRoutes = router;
