import { z } from "zod";

export const orderProductSchema = z.object({
  product: z.string().min(8, "Product ID is required"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .min(0, "Price must be greater than 0")
    .nonnegative("Price must be a positive number"),
});

export const orderSchemaValidation = z.object({
  email: z.string().email("Invalid email address"),
  products: z
    .array(orderProductSchema)
    .min(1, "At least one product is required"),
  totalPrice: z
    .number()
    .min(0, "Total price must be greater than 0")
    .nonnegative("Total price must be a positive number"),
  phone: z
    .string()
    .length(11, "Phone number must be exactly 11 digits")
    .regex(/^01\d{9}$/, "Phone number must start with '01'"),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  paymentStatus: z.enum(["Pending", "Paid", "Failed"]),
  transactionId: z.string().nullable().default(null),
  orderStatus: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
});
