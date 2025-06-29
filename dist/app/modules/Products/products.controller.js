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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.upload = void 0;
const prodcuts_service_1 = require("./prodcuts.service");
const products_model_1 = __importDefault(require("./products.model"));
const cloudinary_1 = require("../../../utils/cloudinary");
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ status: false, message: "Image file is missing" });
        }
        // Upload image to Cloudinary
        const result = yield (0, cloudinary_1.sendImageToCloudinary)(req.file.originalname, req.file.buffer);
        const newProduct = {
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            quantity: Number(req.body.quantity),
            price: Number(req.body.price),
            category: req.body.category,
            inStock: req.body.inStock === "true",
            image: result.secure_url,
        };
        const savedProduct = yield prodcuts_service_1.productService.createProductsInDb(newProduct);
        return res
            .status(201)
            .json({ status: true, message: "Product created", data: savedProduct });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        return res
            .status(500)
            .json({ status: false, error: "Image upload failed" });
    }
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // let query: any = {};
    let query = { isDeleted: false };
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
    // handle price ranges
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = Object.assign(Object.assign({}, (req.query.minPrice ? { $gte: Number(req.query.minPrice) } : {})), (req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : {}));
    }
    const sortOrder = req.query.sortBy === "1" ? 1 : -1;
    const sortBy = { createdAt: sortOrder };
    //handle paginations
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const allLists = yield products_model_1.default.countDocuments({ isDeleted: false });
    const skip = (page - 1) * limit;
    try {
        const result = yield prodcuts_service_1.productService.getProductDataFromDb({
            searchQuery: query,
            page,
            limit,
            skip,
            sortBy,
        });
        if ((result === null || result === void 0 ? void 0 : result.data.length) < 1) {
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
                total: result === null || result === void 0 ? void 0 : result.totalCount,
                currentPage: page,
                allLists,
                totalPages: Math.ceil((result === null || result === void 0 ? void 0 : result.totalCount) / limit),
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
        const { productId } = req.params;
        let updateData = Object.assign({}, req.body);
        // If a new image is uploaded
        if (req.file) {
            const result = yield (0, cloudinary_1.sendImageToCloudinary)(req.file.originalname, req.file.buffer);
            updateData.image = result.secure_url;
        }
        if (updateData.quantity !== undefined) {
            updateData.quantity = Number(updateData.quantity);
            updateData.isStock = updateData.quantity > 0;
        }
        const updatedProduct = yield prodcuts_service_1.productService.updateProductInDb(productId, updateData);
        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            status: false,
            message: "Product update failed",
            error: error.message,
        });
    }
});
const softDeleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedProduct = yield products_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "Product soft deleted successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        console.error("Soft Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.productController = {
    createProduct,
    getProducts,
    getProductsById,
    deleteProduct,
    updateProduct,
    softDeleteProduct,
};
