const mongoose = require("mongoose");

const activeSchemaSchema = new mongoose.Schema({
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
  schemaName: { type: String, required: true },
  lastAccessedAt: { type: Date, default: Date.now },
});

activeSchemaSchema.index({ userId: 1, assignmentId: 1 });
module.exports = mongoose.model("ActiveSchema", activeSchemaSchema);