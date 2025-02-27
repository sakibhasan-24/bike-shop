import { Request, Response } from "express";
import Order from "../orders/order.model";
import stripe from "../../../utils/stripe";
// import { stripe } from "../config/stripe";
// import Order from "../models/order.model";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, transactionId } = req.body;
    console.log(orderId, transactionId);

    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    order.paymentStatus = "Paid";
    order.transactionId = transactionId;
    console.log(order);
    await order.save();

    res.json({ message: "Payment Successful", order });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
