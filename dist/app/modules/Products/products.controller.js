"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const products_validation_1 = require("./products.validation");
const zod_1 = require("zod");
const prodcuts_service_1 = require("./prodcuts.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bikeData = req.body;
    try {
        const bikeValidateData = products_validation_1.productSchemaValidation.parse(bikeData);
        // console.log(bikeValidateData, "jod");
        const result = yield prodcuts_service_1.productService.createProductsInDb(bikeValidateData);
        res.status(201).json({
            status: true,
            message: "Product created successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(500).json({
                message: "Validation Failed",
                status: false,
                error: error,
                stack: error === null || error === void 0 ? void 0 : error.stack,
            });
        }
        else {
            res.status(500).json({
                message: "Validation Failed",
                status: false,
                error: error,
                stack: error === null || error === void 0 ? void 0 : error.stack,
            });
        }
    }
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    if (req.query.searchTerm) {
        query = {
            $or: [
                { name: { $regex: req.query.searchTerm, $options: "i" } },
                { brand: { $regex: req.query.searchTerm, $options: "i" } },
                { category: { $regex: req.query.searchTerm, $options: "i" } },
            ],
        };
    }
    //   console.log(req.query, "query");
    try {
        const result = yield prodcuts_service_1.productService.getProductDataFromDb(query);
        if ((result === null || result === void 0 ? void 0 : result.length) < 1) {
            res.status(200).json({
                message: "No Bike Found",
                status: false,
            });
        }
        else {
            res.status(200).json({
                message: "Bikes retrieved successfully",
                status: true,
                data: result,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something Went Wrong",
            status: false,
            error: error,
            stack: (error === null || error === void 0 ? void 0 : error.stack) || "No stack Error",
        });
    }
});
const getProductsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prodcuts_service_1.productService.getroductByIdFromDb(req.params.productId);
        res.status(200).json({
            message: "Bike retrieved successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            error: error,
            stack: error === null || error === void 0 ? void 0 : error.stack,
        });
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prodcuts_service_1.productService.deleteProductFromDb(req.params.productId);
        res.status(200).json({
            message: "Bike deleted successfully",
            status: true,
            data: [],
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            error: error,
            stack: (error === null || error === void 0 ? void 0 : error.stack) || "No stack Error",
        });
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prodcuts_service_1.productService.updateProductInDb(req.params.productId, req.body);
        res.status(200).json({
            message: "Bike updated successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            error: error,
            stack: (error === null || error === void 0 ? void 0 : error.stack) || "No stack Error",
        });
    }
});
exports.productController = {
    createProduct,
    getProducts,
    getProductsById,
    deleteProduct,
    updateProduct,
};
