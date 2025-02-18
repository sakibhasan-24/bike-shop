import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../../../middlewares/catchAsync";
import { TUser } from "./user.interface";
import AppError from "../../../utils/AppError";
import User from "./user.model";
import { userSchemaValidation } from "./user.validation";
import config from "../../config";

const userSignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1)take data properly
    //2)validate data using zod
    //3)user exists or not
    //4) if no user then hashed password
    //5) save user in db
    const payload: TUser = req.body;
    const { email, password, name, role } = payload;
    if (!name || !role || !email || !password) {
      throw new AppError(400, "All fields are required");
    }
    const userData = userSchemaValidation.parse(payload);
    const userExists = await User.findOne({ email: userData?.email });
    if (userExists) {
      throw new AppError(400, "Email already exists");
    }
    const newUser = await User.create(userData);
    res.status(200).json({
      message: "User registered successfully",
      status: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  }
);
