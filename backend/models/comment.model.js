import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // For replies
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Update post comment count
commentSchema.post("save", async function (doc) {
  const Post = mongoose.model("Post");
  await Post.incrementCounter(doc.post, "commentsCount");
});

commentSchema.post("remove", async function (doc) {
  const Post = mongoose.model("Post");
  await Post.decrementCounter(doc.post, "commentsCount");
});

// Static methods
commentSchema.statics.getPostComments = async function (postId, limit = 50) {
  return this.find({ post: postId, parentComment: null })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "username avatar")
    .lean();
};

commentSchema.statics.getReplies = async function (commentId) {
  return this.find({ parentComment: commentId })
    .sort({ createdAt: 1 })
    .populate("author", "username avatar")
    .lean();
};

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
