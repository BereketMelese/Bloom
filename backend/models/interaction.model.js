import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "bookmark"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, post: 1, type: 1 }, { unique: true });

// --- INCREMENT ON SAVE ---
interactionSchema.post("save", async function (doc) {
  const PostModel = mongoose.model("Post");
  const fieldName = `${doc.type}sCount`;

  await PostModel.findByIdAndUpdate(doc.post, {
    $inc: { [fieldName]: 1 },
  });
});

// --- DECREMENT ON DELETE ---
interactionSchema.post("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const PostModel = mongoose.model("Post");
  const fieldName = `${doc.type}sCount`;

  await PostModel.findByIdAndUpdate(doc.post, {
    $inc: { [fieldName]: -1 },
  });
});

// Static methods
interactionSchema.statics.getLikes = async function (
  postId,
  { page = 1, limit = 20 } = {}
) {
  const skip = (page - 1) * limit;

  return this.find({ post: postId, type: "like" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username avatar bio")
    .lean();
};

interactionSchema.statics.hasLiked = async function (userId, postId) {
  const like = await this.findOne({
    user: userId,
    post: postId,
    type: "like",
  });
  return !!like;
};

interactionSchema.statics.hasBookmarked = async function (userId, postId) {
  const bookmark = await this.findOne({
    user: userId,
    post: postId,
    type: "bookmark",
  });
  return !!bookmark;
};

const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction;
