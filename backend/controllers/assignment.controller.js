const Assignment = require("../models/assignment.model");
const UserProgress = require("../models/userProgress.model");
const Submission = require("../models/submission.model");
const { createSchema } = require("../services/submission.service")

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    const progressList = await UserProgress.find({ userId: req.userId });
    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.assignmentId.toString()] = p.status;
    });

    const result = assignments.map((assignment) => ({
      ...assignment.toObject(),
      status: progressMap[assignment._id.toString()] || "unattempted",
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    const submissions = await Submission.find({
      userId: req.userId,
      assignmentId: req.params.id,
    }).sort({ createdAt: -1 });

    const progress = await UserProgress.findOne({
      userId: req.userId,
      assignmentId: req.params.id,
    });
    await createSchema(req.userId,assignment);
    console.log("schema created");
    return res.status(200).json({
      assignment,
      submissions,
      status: progress ? progress.status : "unattempted",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllAssignments, getAssignmentById };