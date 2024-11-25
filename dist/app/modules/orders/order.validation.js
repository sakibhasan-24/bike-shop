"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchemaValidation = void 0;
const zod_1 = require("zod");
exports.orderSchemaValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    product: zod_1.z.string().min(8, "Product ID is required"),
    quantity: zod_1.z
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
    totalPrice: zod_1.z
        .number()
        .min(0, "Total price must be greater than 0")
        .nonnegative("Total price must be a positive number"),
});
