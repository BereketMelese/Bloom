import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

// Static methods
notificationSchema.statics.createNotification = async function (data) {
  const { recipient, sender, type, post } = data;

  // Don't create notification for self-actions
  if (recipient.toString() === sender.toString()) {
    return null;
  }

  return this.create({
    recipient,
    sender,
    type,
    post,
  });
};

notificationSchema.statics.getUserNotifications = async function (
  userId,
  limit = 20
) {
  return this.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "username avatar")
    .populate("post", "content")
    .lean();
};

notificationSchema.statics.markAsRead = async function (
  userId,
  notificationId = null
) {
  if (notificationId) {
    return this.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
