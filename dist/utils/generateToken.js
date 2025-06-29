"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
const generateToken = (user) => {
    const tokenPayload = {
        _id: user.id,
        role: user.role,
        email: user.email,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, config_1.default.JWT_SECRET, {
        expiresIn: config_1.default.JWT_EXPIRATION_TIME,
    });
    return token;
};
exports.default = generateToken;
