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
exports.orderController = void 0;
const products_model_1 = __importDefault(require("../Products/products.model"));
const order_validation_1 = require("./order.validation");
const order_model_1 = __importDefault(require("./order.model"));
const order_service_1 = require("./order.service");
const user_model_1 = __importDefault(require("../users/user.model"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = order_validation_1.orderSchemaValidation.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error.errors });
        }
        const { email, products, phone, address, offer } = req.body;
        console.log(typeof offer);
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let calculatedTotalPrice = 0;
        for (const item of products) {
            const product = yield products_model_1.default.findById(item.product);
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
        const finalTotalPrice = Number((calculatedTotalPrice - discountAmount).toFixed(2));
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
            yield products_model_1.default.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }
        const newOrder = yield order_model_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
});
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.OrderService.getRevenueFromOrder();
        res.status(200).json({
            message: "Revenue fetched successfully",
            status: true,
            data: {
                totalRevenue: result,
            },
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
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let orders;
        if (user.role === "admin") {
            // Admin can see all orders
            orders = yield order_model_1.default.find();
        }
        else {
            // Normal user can only see their own orders
            orders = yield order_model_1.default.find({ email: user.email });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderStatus, orderId } = req.body;
        console.log(req.body, "ssss");
        // console.log(req.params.id);
        const order = yield order_model_1.default.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.orderStatus = orderStatus;
        yield order.save();
        res.json({ message: "Order status updated", order });
    }
    catch (error) {
        // console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.orderController = {
    createOrder,
    getRevenue,
    getAllOrders,
    updateOrder,
};
