"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const verifyToken_1 = require("../../../utils/verifyToken");
const verifyAdmin_1 = require("../../../utils/verifyAdmin");
const router = express_1.default.Router();
router.post("/orders", verifyToken_1.verifyToken, order_controller_1.orderController.createOrder);
router.get("/orders/revenue", order_controller_1.orderController.getRevenue);
router.get("/orders", verifyToken_1.verifyToken, order_controller_1.orderController.getAllOrders);
router.put("/orders/:orderId", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, order_controller_1.orderController.updateOrder);
exports.orderRoutes = router;
