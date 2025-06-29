// @ts-nocheck

import express from "express";
import { orderController } from "./order.controller";
import { verifyToken } from "../../../utils/verifyToken";
import { verifyAdmin } from "../../../utils/verifyAdmin";

const router = express.Router();
router.post("/orders", verifyToken, orderController.createOrder);
router.get("/orders/revenue", orderController.getRevenue);
router.get("/orders", verifyToken, orderController.getAllOrders);
router.put(
  "/orders/:orderId",
  verifyToken,
  verifyAdmin,
  orderController.updateOrder
);
export const orderRoutes = router;
