import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.post("/read", protect, markAsRead);
router.post("/read/:id", protect, markAsRead);

export default router;
