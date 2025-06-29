"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const verifyToken_1 = require("../../../utils/verifyToken");
const verifyAdmin_1 = require("../../../utils/verifyAdmin");
const router = express_1.default.Router();
router.post("/auth/signup", user_controller_1.userController.userSignUp);
router.post("/auth/login", user_controller_1.userController.userLogin);
router.get("/users", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, user_controller_1.userController.getAllUsers);
router.patch("/users/:userId", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, user_controller_1.userController.actionUser);
router.put("/users/changePassword", verifyToken_1.verifyToken, user_controller_1.userController.changePassword);
router.put("/users/profile/update", verifyToken_1.verifyToken, user_controller_1.userController.updateProfile);
router.get("/users/admin/stat", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, user_controller_1.userController.getAdminData);
exports.userRoutes = router;
