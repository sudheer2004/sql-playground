import ReactMarkdown from "react-markdown";

export default function HintBox({ hint, loading }) {
  if (!loading && !hint) return null;

  return (
    <div className="hint-box">
      <div className="section-label">💡 Hint</div>
      {loading && (
        <div className="result-loading">
          <span className="spinner" /> Generating hint...
        </div>
      )}
      {!loading && hint && (
        <div className="hint-card">
          <div className="hint-label">Hint</div>
          <ReactMarkdown>{hint}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}