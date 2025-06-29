"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* const catchAsync = (fun) => {
  fun(req, res, next).catch(next);
}; */
//req res,next is undefined
//catchAsync execute req,res,next before  express pass req,res,next .so undefined
//catchAsync immediately executes fun before fun without waiting for request
//Our GOAL: catchAsync should return a function,that express will call it later
const catchAsync = (fun) => {
    return (req, res, next) => {
        Promise.resolve(fun(req, res, next)).catch((err) => next(err));
    };
};
exports.default = catchAsync;
