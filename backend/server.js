const express = require("express");
const assignmentRoutes = require("./routes/assignment.routes");
const authRoutes = require("./routes/auth.routes");
const submissionRoutes = require("./routes/submission.routes");
const authMiddleware = require("./middleware/auth.middleware");
const startCleanupJob = require("./services/cleanup.service");
const connectMongoDB = require("./config/db");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use("/auth",authRoutes);
app.use(authMiddleware);
app.use("/assignment",assignmentRoutes);
app.use("/submission",submissionRoutes);



startCleanupJob();

const startServer = async () => {
  await connectMongoDB();
  startCleanupJob();
  app.listen(process.env.PORT || 5003, () => {
    console.log("server started successfully");
  });
};
startServer();