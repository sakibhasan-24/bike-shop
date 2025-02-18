import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../../../middlewares/catchAsync";
import { TUser } from "./user.interface";
import AppError from "../../../utils/AppError";
import User from "./user.model";

const userSignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1)take data properly
    //2)validate data
    //3)user exists or not
    //4) if no user then hashed password
    //5) save user in db
    const payload: TUser = req.body;
    const { email, password, name, role } = payload;
    if (!name || !role || !email || !password) {
      throw new AppError(400, "All fields are required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError(400, "Email already exists");
    }
  }
);
