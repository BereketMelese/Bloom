import { Notification } from "../models/index.js";

export const getNotifications = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const notifications = await Notification.getUserNotifications(
      req.user._id,
      limit
    );

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;

    if (id) {
      const notification = await Notification.markAsRead(req.user._id, id);

      res.json({
        success: true,
        notification,
      });
    } else {
      await Notification.markAsRead(req.user._id);
      res.json({
        success: true,
        message: "All notifications marked as read",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
