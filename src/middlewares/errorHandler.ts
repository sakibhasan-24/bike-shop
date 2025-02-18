import { NextFunction, Request, Response } from "express";
import { IError } from "../types/error.interface";

const globalErrorHandler = async (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    status: false,
    error: err,
    stack: err.stack,
  });
};

export default globalErrorHandler;
