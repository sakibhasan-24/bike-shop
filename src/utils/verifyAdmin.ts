import { NextFunction, Request, Response } from "express";
import config from "../app/config";
import jwt from "jsonwebtoken";
import AppError from "./AppError";

export interface CustomRequest extends Request {
  user?: any;
}

export const verifyAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token, "from admin");

    if (!token) {
      throw new AppError(401, "Unauthorized! Please Try Again Later.");
    }

    const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    req.user = decoded as any;

    if (req.user.role !== "admin") {
      throw new AppError(403, "Forbidden! Admin access required.");
    }

    next();
  } catch (error: any) {
    next(new AppError(401, error.message || "Invalid "));
  }
};
