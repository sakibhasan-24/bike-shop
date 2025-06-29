"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    DBURL: process.env.DBURL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_KEY_SECRET: process.env.CLOUDINARY_API_KEY_SECRET,
    CLOUDINARY_API_KEY_NAME: process.env.CLOUDINARY_API_KEY_NAME,
    STORE_ID: process.env.STORE_ID,
    STORE_PASS: process.env.STORE_PASS,
    FURL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    SSLCOMMERZ_API_URL: process.env.SSLCOMMERZ_API_URL,
    STRIPE_SECRET: process.env.STRIPE_API_SECRET,
};
