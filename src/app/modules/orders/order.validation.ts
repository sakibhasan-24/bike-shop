import { z } from "zod";

export const orderSchemaValidation = z.object({
  email: z.string().email("Invalid email address"),
  product: z.string().min(8, "Product ID is required"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  totalPrice: z
    .number()
    .min(0, "Total price must be greater than 0")
    .nonnegative("Total price must be a positive number"),
});
