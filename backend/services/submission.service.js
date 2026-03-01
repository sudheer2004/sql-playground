require("dotenv").config();
const { Pool } = require("pg");
const ActiveSchema = require("../models/activeSchema.model");

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});

const getSchemaName = (userId, assignmentId) => {
  return `user_${userId}_${assignmentId}`.toLowerCase();
};

const createSchema = async (userId, assignment) => {
  const assignmentId = assignment._id;
  const schemaName = getSchemaName(userId, assignmentId);
  const client = await pool.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    for (const table of assignment.sampleTables) {
      const columnDefs = table.columns
        .map((col) => `${col.columnName} ${col.dataType}`)
        .join(", ");

      await client.query(
        `CREATE TABLE IF NOT EXISTS ${schemaName}.${table.tableName} (${columnDefs})`
      );

      const { rows } = await client.query(
        `SELECT COUNT(*) FROM ${schemaName}.${table.tableName}`
      );

      if (parseInt(rows[0].count) === 0) {
        for (const row of table.rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

          await client.query(
            `INSERT INTO ${schemaName}.${table.tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
            values
          );
        }
      }
    }

    await ActiveSchema.findOneAndUpdate(
      { userId, assignmentId },
      { schemaName, lastAccessedAt: new Date() },
      { upsert: true }
    );

    return schemaName;
  } catch (err) {
    throw new Error(`Schema creation failed: ${err.message}`);
  } finally {
    client.release();
  }
};

const executeQuery = async (schemaName, studentQuery) => {
  const client = await pool.connect();

  try {
    await client.query(`SET search_path TO ${schemaName}`);
    await client.query("BEGIN");
    const result = await client.query(studentQuery);
    await client.query("ROLLBACK");

    return { success: true, rows: result.rows, fields: result.fields.map(f => f.name) };
  } catch (err) {
    await client.query("ROLLBACK");
    return { success: false, message: err.message };
  } finally {
    await client.query(`SET search_path TO public`);
    client.release();
  }
};

const compareResults = (studentRows, expectedOutput) => {
  const normalizeRows = (rows) => {
    return rows.map((row) => {
      const normalized = {};
      for (const key of Object.keys(row)) {
        const val = row[key];
        normalized[key] = isNaN(val) || val === "" ? val : Number(val);
      }
      return normalized;
    });
  };

  const sortRows = (rows) => {
    if (!rows || rows.length === 0) return rows;
    const keys = Object.keys(rows[0]);
    return [...rows].sort((a, b) => {
      for (const key of keys) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
      }
      return 0;
    });
  };

  const sortedStudent = sortRows(normalizeRows(studentRows));
  const sortedExpected = sortRows(normalizeRows(expectedOutput.value));

  return JSON.stringify(sortedStudent) === JSON.stringify(sortedExpected)
    ? "correct"
    : "wrong";
};


module.exports = { createSchema,executeQuery,compareResults , pool  };