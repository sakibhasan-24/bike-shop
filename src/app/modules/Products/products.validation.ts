// import { z } from "zod";
// enum BikeCategory {
//   Mountain = "Mountain",
//   Road = "Road",
//   Hybrid = "Hybrid",
//   Electric = "Electric",
// }
// const BikeCategoryEnum = z.enum([
//   BikeCategory.Mountain,
//   BikeCategory.Road,
//   BikeCategory.Hybrid,
//   BikeCategory.Electric,
// ]);
// export const productSchemaValidation = z.object({
//   name: z.string().min(1, "Name is required"),
//   brand: z.string().min(1, "Brand is required"),
//   price: z.number().min(1, "Price must be at least 1"),
//   description: z.string().min(1, "Description is required"),
//   quantity: z.number().min(1, "Quantity can not be negative"),
//   inStock: z.boolean(),
//   isDeleted: z.boolean().optional(),
//   image: z.string(),
//   category: BikeCategoryEnum,
// });
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

const ReviewSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating can't be more than 5"),
  text: z.string().optional(),
});

export const productSchemaValidation = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(1, "Price must be at least 1"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  inStock: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  image: z.string().url("Image must be a valid URL"),
  category: BikeCategoryEnum,
  reviews: z.array(ReviewSchema).optional(),
  averageRating: z.number().min(0).max(5).optional(),
});
