// catchAsync takes a function as parameter
import { Request, Response, NextFunction, RequestHandler } from "express";

/* const catchAsync = (fun) => {
  fun(req, res, next).catch(next);
}; */
//req res,next is undefined
//catchAsync execute req,res,next before  express pass req,res,next .so undefined

//catchAsync immediately executes fun before fun without waiting for request

//Our GOAL: catchAsync should return a function,that express will call it later

const catchAsync = (fun: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
