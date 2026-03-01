const cron = require("node-cron");
const ActiveSchema = require("../models/activeSchema.model");
const { pool } = require("./submission.service");

const cleanupSchemas = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const expiredSchemas = await ActiveSchema.find({
      lastAccessedAt: { $lt: oneHourAgo },
    });

    if (expiredSchemas.length === 0) return;

    let client;
    try {
      client = await pool.connect();
    } catch (err) {
      console.error(`Cleanup skipped - could not connect to Postgres: ${err.message}`);
      return;
    }

    try {
      for (const schema of expiredSchemas) {
        await client.query(`DROP SCHEMA IF EXISTS ${schema.schemaName} CASCADE`);
        await ActiveSchema.deleteOne({ _id: schema._id });
        console.log(`Cleaned up schema: ${schema.schemaName}`);
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Cleanup failed: ${err.message}`);
  }
};

const startCleanupJob = () => {
  cron.schedule("*/15 * * * *", () => {
    console.log("Running schema cleanup job...");
    cleanupSchemas();
  });
};

module.exports = startCleanupJob ;