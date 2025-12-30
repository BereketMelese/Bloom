import { Follow, Post, User } from "../models/index.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.username = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .select(
        "username avatar bio followersCount followingCount postsCount streak"
      )
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username avatar bio followersCount followingCount postsCount streak createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let isFollowing = false;
    if (req.user) {
      isFollowing = await Follow.isFollowing(req.user._id, req.params.id);
    }

    const recentPosts = await Post.find({
      author: req.params.id,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("content category createdAt likesCount commentsCount");

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        isFollowing,
        isMe: req.user._id.toString() === req.params.id,
      },
      recentPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const followers = await Follow.getFollowers(req.params.id)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalFollowers = await Follow.countDocuments({
      following: req.params.id,
    });

    const followerList = followers.map((f) => f.follower);

    res.json({
      success: true,
      results: followerList.length,
      total: totalFollowers,
      totalPages: Math.ceil(totalFollowers / limit),
      currentPage: page,
      followers: followerList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const following = await Follow.getFollowing(req.params.id)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalFollowing = await Follow.countDocuments({
      follower: req.params.id,
    });

    const followingList = following.map((f) => f.following);

    res.json({
      success: true,
      results: followingList.length,
      total: totalFollowing,
      totalPages: Math.ceil(totalFollowing / limit),
      currentPage: page,
      following: followingList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const existing = await Follow.isFollowing(req.user._id, targetUserId);
    if (existing) {
      // Unfollow
      await Follow.findByIdAndDelete({ _id: existing._id });

      return res.json({
        success: true,
        message: "Unfollowed successfully",
        isFollowing: false,
      });
    } else {
      // Follow
      const newFollow = new Follow({
        follower: req.user._id,
        following: targetUserId,
      });
      await newFollow.save();

      return res.status(201).json({
        success: true,
        message: "Followed successfully",
        isFollowing: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
