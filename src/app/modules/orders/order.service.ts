import TOrders from "./order.interface";
import Order from "./order.model";

const createOrderInDb = async (orderData: TOrders) => {
  const result = await Order.create(orderData);
  return result;
};

export const OrderService = {
  createOrderInDb,
};
