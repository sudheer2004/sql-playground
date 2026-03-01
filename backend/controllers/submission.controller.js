const Assignment = require("../models/assignment.model");
const Submission = require("../models/submission.model");
const UserProgress = require("../models/userProgress.model");
const ActiveSchema = require("../models/activeSchema.model");
const { createSchema, executeQuery, compareResults } = require("../services/submission.service");

const submitQuery = async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }
  
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    let activeSchema = await ActiveSchema.findOne({ userId: req.userId, assignmentId });
    if (!activeSchema) {
      await createSchema(req.userId, assignment);
    } else {
      await ActiveSchema.findOneAndUpdate(
        { userId: req.userId, assignmentId },
        { lastAccessedAt: new Date() }
      );
    }

    const schemaName = `user_${req.userId}_${assignmentId}`.toLowerCase();
    const executionResult = await executeQuery(schemaName, query);
    if (!executionResult.success) {
      await Submission.create({
        userId: req.userId,
        assignmentId,
        query,
        status: "error",
      });

      await UserProgress.findOneAndUpdate(
        { userId: req.userId, assignmentId },
        { $setOnInsert: { status: "attempted" } },
        { upsert: true }
      );

      return res.status(200).json({ status: "error", message: executionResult.message });
    }

    const verdict = compareResults(executionResult.rows, assignment.expectedOutput);
    await Submission.create({
      userId: req.userId,
      assignmentId,
      query,
      status: verdict,
    });

    await UserProgress.findOneAndUpdate(
      { userId: req.userId, assignmentId },
      verdict === "correct"
        ? { status: "solved" }
        : { $setOnInsert: { status: "attempted" } },
      { upsert: true }
    );

    return res.status(200).json({
      status: verdict,
      rows: executionResult.rows,
      fields: executionResult.fields,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { submitQuery };