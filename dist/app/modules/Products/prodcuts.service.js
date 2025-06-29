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
exports.productService = void 0;
const products_model_1 = __importDefault(require("./products.model"));
const createProductsInDb = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const bikeResult = new products_model_1.default(product);
    const result = yield bikeResult.save();
    return result;
});
const getProductDataFromDb = (_a) => __awaiter(void 0, [_a], void 0, function* ({ searchQuery, page, limit, sortBy, }) {
    const skip = (page - 1) * limit;
    const totalCount = yield products_model_1.default.countDocuments(searchQuery);
    console.log(searchQuery);
    const data = yield products_model_1.default.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .exec();
    return { data, totalCount };
});
const getroductByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.default.findOne({ _id: id });
    console.log(id, "ser");
    if (!result) {
        throw new Error("Bike not found");
    }
    return result;
});
const deleteProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyDeleted = yield products_model_1.default.findById(id);
    if (alreadyDeleted === null || alreadyDeleted === void 0 ? void 0 : alreadyDeleted.isDeleted) {
        throw new Error("Bike already deleted");
    }
    const result = yield products_model_1.default.findByIdAndUpdate(id, { isDeleted: true });
    return result;
});
const updateProductInDb = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    console.log(result, "result");
    return result;
});
exports.productService = {
    createProductsInDb,
    getProductDataFromDb,
    getroductByIdFromDb,
    deleteProductFromDb,
    updateProductInDb,
};
