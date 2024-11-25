import { model, Schema } from "mongoose";
import TOrders from "./order.interface";

const OrderlModel = new Schema<TOrders>({
  email: {
    type: String,
    required: true,
  },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});
const Order = model<TOrders>("Order", OrderlModel);

export default Order;
