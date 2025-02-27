import { Request, Response } from "express";
import Bike from "../Products/products.model";
import { orderSchemaValidation } from "./order.validation";
import Order from "./order.model";
import { ZodError } from "zod";
import { OrderService } from "./order.service";
import User from "../users/user.model";

const createOrder = async (req: Request, res: Response) => {
  try {
    const validationResult = orderSchemaValidation.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { email, products, phone, address, offer } = req.body;
    console.log(typeof offer);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let calculatedTotalPrice = 0;
    for (const item of products) {
      const product = await Bike.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${item.product} not found.` });
      }
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product ${item.product}.` });
      }
      calculatedTotalPrice += product.price * item.quantity;
    }

    const discountAmount = offer
      ? Number(((calculatedTotalPrice * Number(offer)) / 100).toFixed(2))
      : 0;
    const finalTotalPrice = Number(
      (calculatedTotalPrice - discountAmount).toFixed(2)
    );

    // console.log({
    //   offer,
    //   finalTotalPrice,
    //   calculatedTotalPrice,
    //   discountAmount,
    // });

    if (Number(req.body.totalPrice.toFixed(2)) !== finalTotalPrice) {
      return res
        .status(400)
        .json({ error: "Total price mismatch. Please refresh and try again." });
    }

    for (const item of products) {
      await Bike.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    const newOrder = await Order.create({
      email,
      products,
      totalPrice: finalTotalPrice,
      phone,
      address,
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

const getRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getRevenueFromOrder();

    res.status(200).json({
      message: "Revenue fetched successfully",
      status: true,
      data: {
        totalRevenue: result,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      status: false,
      error: error,
    });
  }
};

// const getAllOrders = async (req: Request, res: Response) => {
//   try {
//     const result = await OrderService.getAllOrders();
//     res.status(200).json({
//       message: "Orders fetched successfully",
//       status: true,
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//       status: false,
//       error: error,
//     });
//   }
// };

// Get all orders (User can only see their own, Admin can see all)
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let orders;
    if (user.role === "admin") {
      // Admin can see all orders
      orders = await Order.find();
    } else {
      // Normal user can only see their own orders
      orders = await Order.find({ email: user.email });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderStatus, orderId } = req.body;
    console.log(req.body, "ssss");
    // console.log(req.params.id);
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    // console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const orderController = {
  createOrder,
  getRevenue,
  getAllOrders,
  updateOrder,
};
