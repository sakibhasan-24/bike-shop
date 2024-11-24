import mongoose, { model, Schema } from "mongoose";
import TProducts from "./products.interface";
import { NextFunction } from "express";

const BikeModel = new Schema<TProducts>(
  {
    name: {
      type: String,
      required: [true, "name field must be required"],
    },
    brand: {
      type: String,
      required: [true, "brand field must be required"],
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: function () {
        return this.quantity > 0;
      },
    },
    category: {
      type: String,
      enum: {
        values: ["Mountain", "Road", "Hybrid", "Electric"],
        message: "{VALUE} is not a valid category.",
      },
      required: [true, "The category field is required."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
BikeModel.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });

  this.select("-isDeleted");
  next();
});
const Bike = model<TProducts>("Product", BikeModel);

export default Bike;
