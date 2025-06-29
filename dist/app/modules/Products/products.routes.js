"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bikeRoutes = void 0;
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const verifyToken_1 = require("../../../utils/verifyToken");
const verifyAdmin_1 = require("../../../utils/verifyAdmin");
const router = express_1.default.Router();
router.post("/products", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, products_controller_1.upload.single("image"), products_controller_1.productController.createProduct);
router.get("/products", products_controller_1.productController.getProducts);
router.get("/products/:productId", products_controller_1.productController.getProductsById);
router.patch("/products/:id", products_controller_1.productController.softDeleteProduct);
router.put("/products/:productId", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, products_controller_1.upload.single("image"), products_controller_1.productController.updateProduct);
router.put("/add-review/:productId", verifyToken_1.verifyToken, products_controller_1.productController.addOrUpdateReview);
exports.bikeRoutes = router;
