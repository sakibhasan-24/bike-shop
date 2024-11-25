"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const router = express_1.default.Router();
router.post("/products", products_controller_1.productController.createProduct);
router.get("/products", products_controller_1.productController.getProducts);
router.get("/products/:productId", products_controller_1.productController.getProductsById);
router.delete("/products/:productId", products_controller_1.productController.deleteProduct);
router.put("/products/:productId", products_controller_1.productController.updateProduct);
exports.bikeRoutes = router;
