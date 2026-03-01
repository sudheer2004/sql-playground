import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import QueryEditor from "../components/QueryEditor";
import ActionBar from "../components/ActionBar";
import ResultBox from "../components/ResultBox";
import HintBox from "../components/HintBox";
import SampleDataViewer from "../components/SampleDataViewer";
import SubmissionHistory from "../components/Submissionhistory.jsx";

const difficultyClass = {
  Easy: "badge badge-easy",
  Medium: "badge badge-medium",
  Hard: "badge badge-hard",
};

export default function Assignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState("unattempted");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [hinting, setHinting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/assignment/${id}`);
        setAssignment(res.data.assignment);
        setSubmissions(res.data.submissions);
        setStatus(res.data.status);

        if (res.data.submissions.length > 0) {
          setQuery(res.data.submissions[0].query);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleExecute = async () => {
    if (!query.trim()) return;
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.post(`/submission/${id}`, { query });
      setResult(res.data);
      if (res.data.status === "correct") setStatus("solved");
      else if (status === "unattempted") setStatus("attempted");

      setSubmissions((prev) => [
        { query, status: res.data.status, createdAt: new Date() },
        ...prev,
      ]);
    } catch (err) {
      setResult({ status: "error", message: "Something went wrong" });
    } finally {
      setExecuting(false);
    }
  };

  const handleHint = async () => {
    setHinting(true);
    setHint(null);
    try {
      const res = await api.get(`/assignment/${id}/hint`);
      setHint(res.data.hint);
    } catch (err) {
      setHint("Could not generate hint at this time.");
    } finally {
      setHinting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!assignment) {
    return (
      <div className="playground">
        <header className="playground-header">
          <span className="header-icon"></span>
          <h1>SQL Playground</h1>
        </header>
        <main className="assignments-page">
          <p>Assignment not found.</p>
          <button className="btn btn--execute" onClick={() => navigate("/assignments")}>
            ← Back
          </button>
        </main>
      </div>
    );
  }

  const expectedRows = assignment.expectedOutput?.value || [];
  const expectedCols = expectedRows.length > 0 ? Object.keys(expectedRows[0]) : [];

  return (
    <div className="playground">
      <header className="playground-header">
        <button className="back-btn" onClick={() => navigate("/assignments")}>←</button>
        <span className="header-icon"></span>
        <h1>SQL Playground</h1>
        <span className="header-assignment-info">
          {assignment.title}
          <span className={difficultyClass[assignment.description]} style={{ marginLeft: "0.5rem" }}>
            {assignment.description}
          </span>
        </span>
      </header>

      <main className="editor-split">
        {/* Left panel */}
        <div className="editor-panel-schema">
          <div className="editor-assignment-desc-inline">
            <div className="section-label">Assignment</div>
            <p>{assignment.question}</p>
          </div>

          <SampleDataViewer sampleTables={assignment.sampleTables} />

          {/* Expected Output */}
          {expectedRows.length > 0 && (
            <div className="sample-data-viewer">
              <div className="section-label">Expected Output</div>
              <div className="sample-table-wrap">
                <table className="sample-table">
                  <thead>
                    <tr>
                      {expectedCols.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expectedRows.map((row, i) => (
                      <tr key={i}>
                        {expectedCols.map((col) => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submission history */}
          <SubmissionHistory
            submissions={submissions}
            onLoadQuery={(q) => setQuery(q)}
          />
        </div>

        {/* Right panel */}
        <div className="editor-panel-work">
          <div className="editor-work-top">
            <QueryEditor value={query} onChange={setQuery} />
            <ActionBar
              onExecute={handleExecute}
              onHint={handleHint}
              executing={executing}
              hinting={hinting}
            />
          </div>
          <div className="editor-work-bottom">
            <ResultBox result={result} loading={executing} />
            <HintBox hint={hint} loading={hinting} />
          </div>
        </div>
      </main>
    </div>
  );
}