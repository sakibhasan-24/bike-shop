"use strict";
// @ts-nocheck
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
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const catchAsync_1 = __importDefault(require("../../../middlewares/catchAsync"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const user_validation_1 = require("./user.validation");
const generateToken_1 = __importDefault(require("../../../utils/generateToken"));
const config_1 = __importDefault(require("../../config"));
const userSignUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1)take data properly
    //2)validate data using zod
    //3)user exists or not
    //4) if no user then hashed password
    //5) save user in db
    const payload = req.body;
    console.log(payload);
    const { email, password, name } = payload;
    if (!name || !email || !password) {
        throw new AppError_1.default(400, "All fields are required");
    }
    const userData = user_validation_1.userSchemaValidation.parse(payload);
    const userExists = yield user_model_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (userExists) {
        throw new AppError_1.default(400, "Email already exists");
    }
    const newUser = yield user_model_1.default.create(userData);
    console.log(newUser);
    const token = (0, generateToken_1.default)({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
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
}));
const userLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        throw new AppError_1.default(400, "All fields are required");
    }
    const userData = user_validation_1.userLoginSchema.parse({ email, password });
    const user = yield user_model_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    console.log(user, "from");
    if (!user) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(401, "Invalid ");
    }
    const token = (0, generateToken_1.default)({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
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
}));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.default.find({});
        res.status(200).json({
            message: "Users gets successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: error,
        });
    }
});
const actionUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // console.log(userId);
        // console.log(req.user);
        const adminId = req.user.email;
        console.log(adminId);
        const adminUser = yield user_model_1.default.findOne({ email: adminId });
        console.log(adminUser);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied! Admins Only." });
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.json({
            message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} Successfully`,
            user,
        });
    }
    catch (error) {
        console.error("Error toggling block status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        user.password = newPassword;
        yield user.save();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const products_model_1 = __importDefault(require("../Products/products.model"));
const order_model_1 = __importDefault(require("../orders/order.model"));
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, email } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        if (!name && !email) {
            return res
                .status(400)
                .json({ message: "Name and email are required", success: false });
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", success: false });
        }
        user.name = name;
        user.email = email;
        yield user.save();
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
    }
    catch (error) {
        console.error("Update profile error:", error);
        if (error.code === 11000 && ((_b = error.keyPattern) === null || _b === void 0 ? void 0 : _b.email)) {
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
});
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
const getAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const admin = yield user_model_1.default.findById(userId);
        if (!admin) {
            return res
                .status(404)
                .json({ message: "Admin not found", success: false });
        }
        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Forbidden", success: false });
        }
        // 📦 Products
        const totalProducts = yield products_model_1.default.countDocuments();
        // 👥 Users
        const totalUsers = yield user_model_1.default.countDocuments();
        const activeUsers = yield user_model_1.default.countDocuments({ isBlocked: false });
        const blockedUsers = yield user_model_1.default.countDocuments({ isBlocked: true });
        // 📦 Orders
        const totalOrders = yield order_model_1.default.countDocuments();
        const deliveredOrders = yield order_model_1.default.countDocuments({
            orderStatus: "Delivered",
        });
        const shippedOrders = yield order_model_1.default.countDocuments({
            orderStatus: "Shipped",
        });
        const processingOrders = yield order_model_1.default.countDocuments({
            orderStatus: "Processing",
        });
        const pendingOrders = yield order_model_1.default.countDocuments({
            orderStatus: { $in: ["Shipped", "Processing"] },
            paymentStatus: "Pending",
        });
        // 💰 Revenue: sum of totalPrice where paymentStatus is "paid"
        const paidOrders = yield order_model_1.default.find({ paymentStatus: "Paid" });
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
    }
    catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
});
exports.userController = {
    userSignUp,
    userLogin,
    getAllUsers,
    actionUser,
    changePassword,
    updateProfile,
    getAdminData,
};
