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
router.delete("/products/:productId", productController.deleteProduct);
router.put(
  "/products/:productId",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  productController.updateProduct
);
export const bikeRoutes = router;
