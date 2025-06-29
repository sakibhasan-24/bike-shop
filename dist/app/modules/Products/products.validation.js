"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchemaValidation = void 0;
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
const zod_1 = require("zod");
var BikeCategory;
(function (BikeCategory) {
    BikeCategory["Mountain"] = "Mountain";
    BikeCategory["Road"] = "Road";
    BikeCategory["Hybrid"] = "Hybrid";
    BikeCategory["Electric"] = "Electric";
})(BikeCategory || (BikeCategory = {}));
const BikeCategoryEnum = zod_1.z.enum([
    BikeCategory.Mountain,
    BikeCategory.Road,
    BikeCategory.Hybrid,
    BikeCategory.Electric,
]);
const ReviewSchema = zod_1.z.object({
    user: zod_1.z.string().min(1, "User ID is required"),
    rating: zod_1.z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating can't be more than 5"),
    text: zod_1.z.string().optional(),
});
exports.productSchemaValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    brand: zod_1.z.string().min(1, "Brand is required"),
    price: zod_1.z.number().min(1, "Price must be at least 1"),
    description: zod_1.z.string().min(1, "Description is required"),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
    inStock: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
    image: zod_1.z.string().url("Image must be a valid URL"),
    category: BikeCategoryEnum,
    reviews: zod_1.z.array(ReviewSchema).optional(),
    averageRating: zod_1.z.number().min(0).max(5).optional(),
});
