import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: ["goal", "task", "reflection"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    images: [String],

    tags: [String],

    // Counters
    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    bookmarksCount: {
      type: Number,
      default: 0,
    },

    // Completion
    completedAt: Date,

    // Soft delete
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ likesCount: -1 });
postSchema.index({ createdAt: -1 });

// Update counters
postSchema.statics.incrementCounter = async function (postId, field) {
  return this.findByIdAndUpdate(
    postId,
    { $inc: { [field]: 1 } },
    { new: true }
  );
};

postSchema.statics.decrementCounter = async function (postId, field) {
  return this.findByIdAndUpdate(
    postId,
    { $inc: { [field]: -1 } },
    { new: true }
  );
};

const Post = mongoose.model("Post", postSchema);
export default Post;
