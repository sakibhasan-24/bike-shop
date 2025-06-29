"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPayment = exports.createPaymentIntent = void 0;
const order_model_1 = __importDefault(require("../orders/order.model"));
const stripe_1 = __importDefault(require("../../../utils/stripe"));
// import { stripe } from "../config/stripe";
// import Order from "../models/order.model";
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield order_model_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }
        // Create PaymentIntent
        const paymentIntent = yield stripe_1.default.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100), // Convert to cents
            currency: "usd",
            payment_method_types: ["card"],
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, transactionId } = req.body;
        console.log(orderId, transactionId);
        const order = yield order_model_1.default.findById(orderId);
        console.log(order);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }
        order.paymentStatus = "Paid";
        order.transactionId = transactionId;
        console.log(order);
        yield order.save();
        res.json({ message: "Payment Successful", order });
    }
    catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.confirmPayment = confirmPayment;
