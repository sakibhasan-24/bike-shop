import mongoose, { Schema, model } from "mongoose";
import TOrder, { TOrderProduct } from "./order.interface";

const orderProductSchema = new Schema<TOrderProduct>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bike",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema<TOrder>(
  {
    email: {
      type: String,
      required: true,
    },
    products: [orderProductSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^01\d{9}$/,
    },
    address: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: { type: String, default: null },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = model<TOrder>("Order", orderSchema);

export default Order;
