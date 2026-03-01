const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    status: {
      type: String,
      enum: ["solved", "attempted", "unattempted"],
      default: "unattempted",
    },
  },
  { timestamps: true }
);

userProgressSchema.index({ userId: 1, assignmentId: 1 });
module.exports = mongoose.model("UserProgress", userProgressSchema);