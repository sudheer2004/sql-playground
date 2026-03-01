const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, 
    question: { type: String, required: true },
    sampleTables: [
      {
        tableName: { type: String },
        columns: [
          {
            columnName: { type: String },
            dataType: { type: String },
          },
        ],
        rows: [{ type: mongoose.Schema.Types.Mixed }],
      },
    ],
    expectedOutput: {
      type: { type: String },
      value: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);