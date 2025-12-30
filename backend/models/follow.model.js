import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One follow relationship per pair
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Update user counters when follow is created/deleted
followSchema.post("save", async function (doc) {
  const User = mongoose.model("User");

  await Promise.all([
    User.findByIdAndUpdate(doc.follower, { $inc: { followingCount: 1 } }),
    User.findByIdAndUpdate(doc.following, { $inc: { followersCount: 1 } }),
  ]);
});

followSchema.post("findOneAndDelete", async function (doc) {
  const User = mongoose.model("User");

  await Promise.all([
    User.findByIdAndUpdate(doc.follower, { $inc: { followingCount: -1 } }),
    User.findByIdAndUpdate(doc.following, { $inc: { followersCount: -1 } }),
  ]);
});

// Static methods
followSchema.statics.getFollowers = function (userId) {
  return this.find({ following: userId }).populate(
    "follower",
    "username avatar bio followersCount"
  );
};

followSchema.statics.getFollowing = function (userId) {
  return this.find({ follower: userId }).populate(
    "following",
    "username avatar bio followingCount"
  );
};

followSchema.statics.isFollowing = async function (followerId, followingId) {
  const follow = await this.findOne({
    follower: followerId,
    following: followingId,
  });
  return follow;
};

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
