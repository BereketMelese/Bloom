import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Identity
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    passwordChangedAt: Date,

    // Profile
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    avatar: {
      type: String,
      default: "",
    },

    coverImg: {
      type: String,
      default: "",
    },

    // Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Stats
    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    postsCount: {
      type: Number,
      default: 0,
    },

    // Activity tracking
    lastActive: {
      type: Date,
      default: Date.now,
    },

    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
    },

    activityHeatmap: [
      {
        date: { type: Date },
        count: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Update activity streak
userSchema.methods.updateStreak = function () {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const lastDate = new Date(this.lastActive);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = now - lastDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Posted the very next day
    this.streak.current += 1;
  } else if (diffDays > 1) {
    // Missed a day, reset
    this.streak.current = 1;
  } else if (this.streak.current === 0) {
    // Brand new user/streak
    this.streak.current = 1;
  }

  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }

  this.lastActive = new Date(); // Update lastActive to now
  return this;
};

userSchema.methods.addActivity = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayEntry = this.activityHeatmap.find(
    (entry) => entry.date.getTime() === today.getTime()
  );

  if (dayEntry) {
    dayEntry.count += 1;
  } else {
    this.activityHeatmap.push({ date: today, count: 1 });
  }

  if (this.activityHeatmap.length > 365) {
    this.activityHeatmap.shift();
  }
};

const User = mongoose.model("User", userSchema);
export default User;
