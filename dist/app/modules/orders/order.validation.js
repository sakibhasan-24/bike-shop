"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchemaValidation = exports.orderProductSchema = void 0;
const zod_1 = require("zod");
exports.orderProductSchema = zod_1.z.object({
    product: zod_1.z.string().min(8, "Product ID is required"),
    quantity: zod_1.z
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
    price: zod_1.z
        .number()
        .min(0, "Price must be greater than 0")
        .nonnegative("Price must be a positive number"),
});
exports.orderSchemaValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    products: zod_1.z
        .array(exports.orderProductSchema)
        .min(1, "At least one product is required"),
    totalPrice: zod_1.z
        .number()
        .min(0, "Total price must be greater than 0")
        .nonnegative("Total price must be a positive number"),
    phone: zod_1.z
        .string()
        .length(11, "Phone number must be exactly 11 digits")
        .regex(/^01\d{9}$/, "Phone number must start with '01'"),
    address: zod_1.z.string().min(5, "Address must be at least 5 characters long"),
    paymentStatus: zod_1.z.enum(["Pending", "Paid", "Failed"]),
    transactionId: zod_1.z.string().nullable().default(null),
    orderStatus: zod_1.z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
});
