import { useState } from "react";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const statusIcon = {
  correct: "✓",
  wrong: "✗",
  error: "⚠",
};

export default function SubmissionHistory({ submissions, onLoadQuery }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!submissions || submissions.length === 0) return null;

  const toggle = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="submission-history">
      <div className="section-label">Submission History</div>
      <div className="submission-list">
        {submissions.map((s, i) => (
          <div key={i} className={`submission-item submission-item--${s.status}`}>
            <div
              className="submission-item__header"
              onClick={() => toggle(i)}
            >
              <span className="submission-item__icon">{statusIcon[s.status]}</span>
              <span className="submission-item__query">
                {s.query.slice(0, 40)}{s.query.length > 40 ? "..." : ""}
              </span>
              <span className="submission-item__time">{timeAgo(s.createdAt)}</span>
              <span className="submission-item__chevron">
                {expandedIndex === i ? "▲" : "▼"}
              </span>
            </div>

            {expandedIndex === i && (
              <div className="submission-item__body">
                <pre className="submission-item__full-query">{s.query}</pre>
                <button
                  className="btn btn--hint submission-item__load-btn"
                  onClick={() => onLoadQuery(s.query)}
                >
                  Load into editor
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}