import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/post/:id", protect, getComments);
router.post("/post/:id", protect, createComment);

router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
