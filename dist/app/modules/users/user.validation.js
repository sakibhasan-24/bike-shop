"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userSchemaValidation = void 0;
const zod_1 = require("zod");
exports.userSchemaValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    role: zod_1.z
        .enum(["customer", "admin"], {
        message: "Role must be either 'customer' or 'admin'",
    })
        .default("customer"),
    isBloced: zod_1.z.boolean().default(false),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});
