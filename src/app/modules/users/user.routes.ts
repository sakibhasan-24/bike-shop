import express from "express";
import { userController } from "./user.controller";

const router = express.Router();
router.post("/auth/signup", userController.userSignUp);
router.post("/auth/login", userController.userLogin);
export const userRoutes = router;
