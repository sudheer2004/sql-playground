const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { submitQuery } = require("../controllers/submission.controller");

router.post("/:assignmentId", submitQuery);

module.exports = router;