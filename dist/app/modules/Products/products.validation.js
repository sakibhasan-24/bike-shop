"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchemaValidation = void 0;
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
exports.productSchemaValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    brand: zod_1.z.string().min(1, "Brand is required"),
    price: zod_1.z.number().min(1, "Price must be at least 1"),
    description: zod_1.z.string().min(1, "Description is required"),
    quantity: zod_1.z.number().min(0, "Quantity can not be negative"),
    inStock: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean().optional(),
    category: BikeCategoryEnum,
});
