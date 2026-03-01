import { useState } from "react";

export default function SampleDataViewer({ sampleTables }) {
  const [activeTable, setActiveTable] = useState(0);

  if (!sampleTables || sampleTables.length === 0) return null;

  const table = sampleTables[activeTable];

  return (
    <div className="sample-data-viewer">
      <div className="section-label">📋 Table Schemas &amp; Sample Data</div>
      <div className="sample-tabs">
        {sampleTables.map((t, i) => (
          <button
            key={t.tableName}
            className={`sample-tab ${i === activeTable ? "sample-tab-active" : ""}`}
            onClick={() => setActiveTable(i)}
          >
            {t.tableName}
          </button>
        ))}
      </div>
      <div className="sample-table-wrap">
        <table className="sample-table">
          <thead>
            <tr>
              {table.columns.map((col) => (
                <th key={col.columnName}>{col.columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {table.columns.map((col) => (
                  <td key={col.columnName}>{row[col.columnName]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}