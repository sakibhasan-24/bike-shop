// @ts-nocheck
import express from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../../utils/verifyToken";
import { verifyAdmin } from "../../../utils/verifyAdmin";

const router = express.Router();
router.post("/auth/signup", userController.userSignUp);
router.post("/auth/login", userController.userLogin);
router.get("/users", verifyToken, verifyAdmin, userController.getAllUsers);
router.patch(
  "/users/:userId",
  verifyToken,
  verifyAdmin,
  userController.actionUser
);

router.put("/users/changePassword", verifyToken, userController.changePassword);
router.put("/users/profile/update", verifyToken, userController.updateProfile);
router.get(
  "/users/admin/stat",
  verifyToken,
  verifyAdmin,
  userController.getAdminData
);

export const userRoutes = router;
