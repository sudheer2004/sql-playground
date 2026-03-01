const Assignment = require("../models/assignment.model");
const { generateHint } = require("../services/hint.service");

const getHint = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const hint = await generateHint(assignment.question);
    return res.status(200).json({ hint });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getHint };