// @ts-nocheck

import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import catchAsync from "../../../middlewares/catchAsync";
import { TUser } from "./user.interface";
import AppError from "../../../utils/AppError";
import User from "./user.model";
import { userLoginSchema, userSchemaValidation } from "./user.validation";
import generateToken from "../../../utils/generateToken";
import config from "../../config";

const userSignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1)take data properly
    //2)validate data using zod
    //3)user exists or not
    //4) if no user then hashed password
    //5) save user in db
    const payload: TUser = req.body;
    console.log(payload);
    const { email, password, name } = payload;
    if (!name || !email || !password) {
      throw new AppError(400, "All fields are required");
    }
    const userData = userSchemaValidation.parse(payload);
    const userExists = await User.findOne({ email: userData?.email });
    if (userExists) {
      throw new AppError(400, "Email already exists");
    }
    const newUser = await User.create(userData);
    console.log(newUser);
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      status: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  }
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      throw new AppError(400, "All fields are required");
    }
    const userData = userLoginSchema.parse({ email, password });
    const user = await User.findOne({ email: userData?.email });
    console.log(user, "from");
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid ");
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({
      message: "User logged in successfully",
      status: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.find({});
    res.status(200).json({
      message: "Users gets successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      status: false,
      error: error,
    });
  }
};

const actionUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    // console.log(req.user);
    const adminId = req.user.email;
    console.log(adminId);
    const adminUser = await User.findOne({ email: adminId });
    console.log(adminUser);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access Denied! Admins Only." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} Successfully`,
      user,
    });
  } catch (error) {
    console.error("Error toggling block status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { Request, Response } from "express";
import User from "../models/User"; // adjust path as needed
import Bike from "../Products/products.model";
import Order from "../orders/order.model";

const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required", success: false });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

// const getAdminData = async (req: Request, res: Response) => {
//   const user = req.user?._id;
//   try {
//     const admin = await User.findById(user);
//     if (!admin) {
//       return res
//         .status(404)
//         .json({ message: "Admin not found", success: false });
//     }
//     if (admin.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden", success: false });
//     }
//     const totalProducts = await Product.countDocuments();
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isBlocked: false });
//     const blockedUsers = await User.countDocuments({ isBlocked: true });
//     const totalOrders = await Order.countDocuments();
//     const pendingOrders = await Order.countDocuments({ status: "pending" });
//     const shippedOrders = await Order.countDocuments({ status: "shipped" });
//     const processingOrders = await Order.countDocuments({
//       status: "processing",
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };
// const getAdminData = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?._id;

//     const admin = await User.findById(userId);
//     if (!admin) {
//       return res
//         .status(404)
//         .json({ message: "Admin not found", success: false });
//     }

//     if (admin.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden", success: false });
//     }

//     // 📦 Products
//     const totalProducts = await Bike.countDocuments();

//     // 👥 Users
//     const totalUsers = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isBlocked: false });
//     const blockedUsers = await User.countDocuments({ isBlocked: true });

//     // 📦 Orders
//     const totalOrders = await Order.countDocuments();
//     const pendingOrders = await Order.countDocuments({
//       orderStatus: "pending",
//     });
//     const shippedOrders = await Order.countDocuments({
//       orderStatus: "shipped",
//     });
//     const processingOrders = await Order.countDocuments({
//       orderStatus: "processing",
//     });

//     // 💰 Revenue: sum of totalPrice for "processing" orders
//     const processingOrderDocs = await Order.find({ orderStatus: "processing" });

//     const totalRevenue = processingOrderDocs.reduce((sum, order) => {
//       return sum + (order.totalPrice || 0);
//     }, 0);

//     // 📊 Final Response
//     return res.status(200).json({
//       success: true,
//       stats: {
//         totalProducts,
//         totalUsers,
//         activeUsers,
//         blockedUsers,
//         totalOrders,
//         pendingOrders,
//         shippedOrders,
//         processingOrders,
//         totalRevenue: parseFloat(totalRevenue.toFixed(2)),
//         pendingOrderPercentage: totalOrders
//           ? parseFloat(((pendingOrders / totalOrders) * 100).toFixed(2))
//           : 0,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching admin stats:", error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };
const getAdminData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const admin = await User.findById(userId);
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    // 📦 Products
    const totalProducts = await Bike.countDocuments();

    // 👥 Users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // 📦 Orders
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });
    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ["Shipped", "Processing"] },
      paymentStatus: "Pending",
    });

    // 💰 Revenue: sum of totalPrice where paymentStatus is "paid"
    const paidOrders = await Order.find({ paymentStatus: "Paid" });

    const totalRevenue = paidOrders.reduce((sum, order) => {
      return sum + (order.totalPrice || 0);
    }, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        activeUsers,
        blockedUsers,
        totalOrders,
        deliveredOrders,
        pendingOrders,
        shippedOrders,
        processingOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        pendingOrderPercentage: totalOrders
          ? parseFloat(((pendingOrders / totalOrders) * 100).toFixed(2))
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const userController = {
  userSignUp,
  userLogin,
  getAllUsers,
  actionUser,
  changePassword,
  updateProfile,
  getAdminData,
};
