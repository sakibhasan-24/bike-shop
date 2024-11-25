import TOrders from "./order.interface";
import Order from "./order.model";

const createOrderInDb = async (orderData: TOrders) => {
  const result = await Order.create(orderData);
  return result;
};

const getAllOrders = async () => {
  const result = await Order.find();
  return result;
};

const getRevenueFromOrder = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  return result[0]?.totalRevenue || 0;
};
export const OrderService = {
  createOrderInDb,
  getRevenueFromOrder,
  getAllOrders,
};
