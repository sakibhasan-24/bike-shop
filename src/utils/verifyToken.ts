import { NextFunction, Request, Response } from "express";
import config from "../app/config";
import jwt from "jsonwebtoken";
import AppError from "./AppError";
export interface CustomRequest extends Request {
  user?: any;
}
export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError(401, "Unauthorized! Please check your credentials");
  }
  const decoded = jwt.verify(token, config.JWT_SECRET as string);
  req.user = decoded as any;
  next();
};
