import { z } from "zod";

export const userSchemaValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(["customer", "admin"], {
      message: "Role must be either 'customer' or 'admin'",
    })
    .default("customer"),
});
