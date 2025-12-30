import mongoose from "mongoose";
import { User } from "../models/index.js";

export const checkUserExists = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User Id format",
    });
  }

  const userExists = await User.exists({ _id: id });
  if (!userExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  next();
};
