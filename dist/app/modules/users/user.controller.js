"use strict";
// @ts-nocheck
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
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const catchAsync_1 = __importDefault(require("../../../middlewares/catchAsync"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const user_validation_1 = require("./user.validation");
const generateToken_1 = __importDefault(require("../../../utils/generateToken"));
const config_1 = __importDefault(require("../../config"));
const userSignUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1)take data properly
    //2)validate data using zod
    //3)user exists or not
    //4) if no user then hashed password
    //5) save user in db
    const payload = req.body;
    console.log(payload);
    const { email, password, name } = payload;
    if (!name || !email || !password) {
        throw new AppError_1.default(400, "All fields are required");
    }
    const userData = user_validation_1.userSchemaValidation.parse(payload);
    const userExists = yield user_model_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (userExists) {
        throw new AppError_1.default(400, "Email already exists");
    }
    const newUser = yield user_model_1.default.create(userData);
    console.log(newUser);
    const token = (0, generateToken_1.default)({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(201).json({
        message: "User registered successfully",
        status: true,
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
}));
const userLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        throw new AppError_1.default(400, "All fields are required");
    }
    const userData = user_validation_1.userLoginSchema.parse({ email, password });
    const user = yield user_model_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    console.log(user, "from");
    if (!user) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(401, "Invalid ");
    }
    const token = (0, generateToken_1.default)({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({
        message: "User logged in successfully",
        status: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
}));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.default.find({});
        res.status(200).json({
            message: "Users gets successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: error,
        });
    }
});
const actionUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // console.log(userId);
        // console.log(req.user);
        const adminId = req.user.email;
        console.log(adminId);
        const adminUser = yield user_model_1.default.findOne({ email: adminId });
        console.log(adminUser);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied! Admins Only." });
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.json({
            message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} Successfully`,
            user,
        });
    }
    catch (error) {
        console.error("Error toggling block status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        user.password = newPassword;
        yield user.save();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.userController = {
    userSignUp,
    userLogin,
    getAllUsers,
    actionUser,
    changePassword,
};
