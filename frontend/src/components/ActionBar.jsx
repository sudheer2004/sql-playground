export default function ActionBar({ onExecute, onHint, executing, hinting }) {
  return (
    <div className="action-bar">
      <button
        className="btn btn--execute"
        onClick={onExecute}
        disabled={executing || hinting}
      >
        {executing && <span className="spinner" />}
        {executing ? "Running..." : "▶ Execute Query"}
      </button>
      <button
        className="btn btn--hint"
        onClick={onHint}
        disabled={executing || hinting}
      >
        {hinting && <span className="spinner" />}
        {hinting ? "Thinking..." : "💡 Get Hint"}
      </button>
    </div>
  );
}