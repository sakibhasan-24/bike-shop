import { z } from "zod";
enum BikeCategory {
  Mountain = "Mountain",
  Road = "Road",
  Hybrid = "Hybrid",
  Electric = "Electric",
}
const BikeCategoryEnum = z.enum([
  BikeCategory.Mountain,
  BikeCategory.Road,
  BikeCategory.Hybrid,
  BikeCategory.Electric,
]);
export const productSchemaValidation = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(1, "Price must be at least 1"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  inStock: z.boolean(),
  category: BikeCategoryEnum,
});
