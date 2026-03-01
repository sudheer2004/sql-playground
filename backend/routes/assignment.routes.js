const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getAllAssignments, getAssignmentById } = require("../controllers/assignment.controller");
const { getHint } = require("../controllers/hint.controller");

router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);
router.get("/:id/hint", auth, getHint);

module.exports = router;