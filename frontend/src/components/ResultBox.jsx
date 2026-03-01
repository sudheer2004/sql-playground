export default function ResultBox({ result, loading }) {
  return (
    <div className="result-box">
      <div className="section-label">
        Results
        {result && (
          <span className={`verdict verdict--${result.status}`}>
            {result.status === "correct" && " ✓ Correct"}
            {result.status === "wrong" && " ✗ Wrong Answer"}
            {result.status === "error" && " ⚠ Error"}
          </span>
        )}
      </div>

      {loading && (
        <div className="result-loading">
          <span className="spinner" /> Executing query...
        </div>
      )}

      {!loading && !result && (
        <div className="result-empty">Run a query to see results here.</div>
      )}

      {!loading && result?.status === "error" && (
        <div className="result-error">⚠ {result.message}</div>
      )}

      {!loading && result?.rows && result.rows.length === 0 && (
        <div className="result-empty">Query returned no rows.</div>
      )}

      {!loading && result?.rows && result.rows.length > 0 && (
        <table className="result-table">
          <thead>
            <tr>
              {result.fields.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {result.fields.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}