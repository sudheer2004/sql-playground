const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
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
    query: { type: String, required: true },
    status: {
      type: String,
      enum: ["correct", "wrong", "error"],
      required: true,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, assignmentId: 1 });
module.exports = mongoose.model("Submission", submissionSchema);