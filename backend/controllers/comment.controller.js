import { Comment, Notification, Post } from "../models/index.js";

export const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    await Notification.createNotification({
      recipient: post.author,
      sender: req.user._id,
      type: "comment",
      post: postId,
    });

    await comment.populate("author", "username avatar");

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({
      suceess: false,
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const comments = await Comment.getPostComments(req.params.id, limit);
    const replies = [];

    for (const comment of comments) {
      replies[comment._id] = await Comment.getReplies(comment._id);
    }

    res.json({
      success: true,
      comments,
      replies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }

  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  comment.content = req.body.content;
  await comment.save();

  res.json({
    succcess: true,
    comment,
  });
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Comment.findOneAndDelete({ _id: req.params.commentId });

    res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
