import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();
router.post("/orders", orderController.createOrder);
router.get("/orders/revenue", orderController.getRevenue);
router.get("/orders", orderController.getAllOrders);
export const orderRoutes = router;
