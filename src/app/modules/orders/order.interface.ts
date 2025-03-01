import mongoose from "mongoose";

export type TOrderProduct = {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
};

type TOrder = {
  email: string;
  products: TOrderProduct[];
  totalPrice: number;
  phone: string;
  address: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  transactionId: string;
  createdAt: Date;
};

export default TOrder;
