import express from "express";
import { confirmPayment, createPaymentIntent } from "./payment.controller";

const router = express.Router();

router.post("/create-payment", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

export const paymentRoute = router;
