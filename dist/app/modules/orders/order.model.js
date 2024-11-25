"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderlModel = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});
const Order = (0, mongoose_1.model)("Order", OrderlModel);
exports.default = Order;
