import {
  Follow,
  Post,
  Interaction,
  Notification,
  User,
} from "../models/index.js";

export const createPost = async (req, res) => {
  try {
    const { content, category, status, images, tags } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      category,
      status,
      images: images || [],
      tags: tags || [],
    });

    const user = await User.findById(req.user._id);

    user.addActivity();
    user.updateStreak();
    user.postsCount += 1;

    await user.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    let query = { isArchived: false };

    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar");

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
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

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username avatar"
    );

    if (!post || post.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { content, category, images, tags, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || post.isArchived) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (content) post.content = content;
    if (category) post.category = category;
    if (images) post.images = images;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    await post.save();

    res.json({
      successs: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Post is already deleted",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    post.isArchived = true;
    await post.save();

    await User.findByIdAndUpdate(post.author, {
      $inc: { postsCount: -1 },
    });

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: req.params.userId,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar");

    const total = await Post.countDocuments({
      author: req.params.userId,
      isArchived: false,
    });

    res.json({
      success: true,
      posts,
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

export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    const follows = await Follow.find({ follower: req.user.id });
    const followingIds = follows.map((f) => f.following);

    followingIds.push(req.user._id);

    const posts = await Post.find({
      author: { $in: followingIds },
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar");

    const total = await Post.countDocuments({
      author: { $in: followingIds },
      isArchived: false,
    });

    res.json({
      success: true,
      posts,
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

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const existingLike = await Interaction.findOne({
      user: userId,
      post: postId,
      type: "like",
    });

    if (existingLike) {
      await Interaction.findOneAndDelete({ _id: existingLike._id });
      return res.status(200).json({
        liked: false,
        message: "Like removed",
      });
    }

    await Interaction.create({
      user: userId,
      post: postId,
      type: "like",
    });

    res.status(201).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleBookmark = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  try {
    const existingBookmark = await Interaction.findOne({
      user: userId,
      post: postId,
      type: "bookmark",
    });

    if (existingBookmark) {
      await Interaction.findOneAndDelete({ _id: existingBookmark._id });
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    }

    await Interaction.create({
      user: userId,
      post: postId,
      type: "bookmark",
    });

    res.status(201).json({
      bookmarked: true,
      message: "Post bookmarked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLikes = async (req, res) => {
  const postId = req.params.id;

  try {
    const { page = 1, limit = 20 } = req.query;

    const likes = await Interaction.getLikes(postId, {
      page: Number(page),
      limit: Number(limit),
    });

    const totalLikes = await Interaction.countDocuments({
      post: postId,
      type: "like",
    });

    res.status(200).json({
      success: true,
      count: likes.length,
      total: totalLikes,
      currentPage: page,
      totalPages: Math.ceil(totalLikes / limit),
      likes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
