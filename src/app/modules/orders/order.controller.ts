import { Request, Response } from "express";
import Bike from "../Products/products.model";
import { orderSchemaValidation } from "./order.validation";
import Order from "./order.model";
import { ZodError } from "zod";

const createOrder = async (req: Request, res: Response): Promise<any> => {
  //   console.log(req.body);
  const { email, product, quantity, totalPrice } = req.body;
  try {
    const validateData = orderSchemaValidation.parse({
      email,
      product,
      quantity,
      totalPrice,
    });

    const findProduct = await Bike.findById(product);
    if (!findProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }
    if (quantity > Number(findProduct?.quantity)) {
      return res.status(400).json({
        message: "Quantity is greater than available quantity",
        status: false,
      });
    }
    //   req.body.totalPrice = 122;
    //   console.log(totalPrice);
    const updateBike = await Bike.findByIdAndUpdate(
      product,
      {
        $inc: { quantity: -quantity },
        $set: {
          inStock:
            findProduct?.quantity && findProduct?.quantity - quantity <= 0
              ? false
              : true,
        },
      },
      { new: true }
    );
    const newTotalPrice = quantity * findProduct?.price;
    const createOrder = await Order.create(validateData);
    const orderObject = createOrder.toObject();
    const newData = { ...orderObject, totalPrice: newTotalPrice };
    return res.status(201).json({
      message: "Order created successfully",
      status: true,
      data: newData,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(500).json({
        message: "Validation Failed",
        status: false,
        error: error,
        stack: error?.stack,
      });
    } else {
      return res.status(500).json({
        message: "Somethign went wrong",
        status: false,
        error: error,
        stack: error?.stack,
      });
    }
  }

  //   console.log(findProduct);
};

export const orderController = {
  createOrder,
};