export default function QueryEditor({ value, onChange }) {
  return (
    <div className="section">
      <div className="section-label">SQL Query</div>
      <textarea
        className="query-editor query-editor-large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"-- Write your SQL query here...\nSELECT * FROM employees;"}
        spellCheck={false}
      />
    </div>
  );
}