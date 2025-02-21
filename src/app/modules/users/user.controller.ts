import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import catchAsync from "../../../middlewares/catchAsync";
import { TUser } from "./user.interface";
import AppError from "../../../utils/AppError";
import User from "./user.model";
import { userSchemaValidation } from "./user.validation";
import generateToken from "../../../utils/generateToken";
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
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      status: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  }
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) take data properly
    //2) validate data using zod
    //3) user exists or not
    //4) compare password with hashed password
    //5) generate jwt token
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(400, "All fields are required");
    }
    const userData = userSchemaValidation.parse({ email, password });
    const user = await User.findOne({ email: userData?.email });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({
      message: "User logged in successfully",
      status: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

export const userController = {
  userSignUp,
  userLogin,
};
