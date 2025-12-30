import express from "express";
import {
  getFollowers,
  getFollowing,
  getUser,
  getUsers,
  toggleFollow,
} from "../controllers/user.controlller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, checkUserExists, getUser);
router.get("/:id/followers", protect, checkUserExists, getFollowers);
router.get("/:id/following", protect, checkUserExists, getFollowing);
router.post("/:id/follow", protect, checkUserExists, toggleFollow);

export default router;
