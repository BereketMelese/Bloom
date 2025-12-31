import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMe,
  login,
  Logout,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, Logout);

export default router;
