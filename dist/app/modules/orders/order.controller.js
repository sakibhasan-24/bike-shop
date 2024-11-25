"use strict";
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
const zod_1 = require("zod");
const order_service_1 = require("./order.service");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(req.body);
    const { email, product, quantity, totalPrice } = req.body;
    try {
        const validateData = order_validation_1.orderSchemaValidation.parse({
            email,
            product,
            quantity,
            totalPrice,
        });
        const findProduct = yield products_model_1.default.findById(product);
        if (!findProduct) {
            return res
                .status(404)
                .json({ message: "Product not found", status: false });
        }
        if (quantity > Number(findProduct === null || findProduct === void 0 ? void 0 : findProduct.quantity)) {
            return res.status(400).json({
                message: "Quantity is greater than available quantity",
                status: false,
            });
        }
        //   req.body.totalPrice = 122;
        //   console.log(totalPrice);
        const updateBike = yield products_model_1.default.findByIdAndUpdate(product, {
            $inc: { quantity: -quantity },
            $set: {
                inStock: (findProduct === null || findProduct === void 0 ? void 0 : findProduct.quantity) && (findProduct === null || findProduct === void 0 ? void 0 : findProduct.quantity) - quantity <= 0
                    ? false
                    : true,
            },
        }, { new: true });
        const newTotalPrice = quantity * (findProduct === null || findProduct === void 0 ? void 0 : findProduct.price);
        const orderData = Object.assign(Object.assign({}, validateData), { totalPrice: newTotalPrice });
        const createOrder = yield order_service_1.OrderService.createOrderInDb(orderData);
        const orderObject = createOrder.toObject();
        const newData = Object.assign(Object.assign({}, orderObject), { totalPrice: newTotalPrice });
        return res.status(201).json({
            message: "Order created successfully",
            status: true,
            data: newData,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(500).json({
                message: "Validation Failed",
                status: false,
                error: error,
                stack: error === null || error === void 0 ? void 0 : error.stack,
            });
        }
        else {
            return res.status(500).json({
                message: "Somethign went wrong",
                status: false,
                error: error,
                stack: error === null || error === void 0 ? void 0 : error.stack,
            });
        }
    }
    //   console.log(findProduct);
});
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.OrderService.getRevenueFromOrder();
        // console.log(result);
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
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.OrderService.getAllOrders();
        res.status(200).json({
            message: "Orders fetched successfully",
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
exports.orderController = {
    createOrder,
    getRevenue,
    getAllOrders,
};
