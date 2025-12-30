import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getFeed,
  getLikes,
  getPost,
  getPosts,
  getUserPosts,
  toggleBookmark,
  toggleLike,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.post("/", protect, createPost);

router.get("/feed", protect, getFeed);

router.get("/user/:userId", protect, getUserPosts);

router.get("/:id", protect, getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

router.post("/:id/like", protect, toggleLike);
router.post("/:id/bookmark", protect, toggleBookmark);
router.post("/:id/likes", protect, getLikes);

export default router;
