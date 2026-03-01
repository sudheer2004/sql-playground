import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const difficultyClass = {
  Easy: "badge badge-easy",
  Medium: "badge badge-medium",
  Hard: "badge badge-hard",
};

const statusClass = {
  solved: "status status--solved",
  attempted: "status status--attempted",
  unattempted: "status status--unattempted",
};

const statusLabel = {
  solved: "✓ Solved",
  attempted: "~ Attempted",
  unattempted: "Unattempted",
};

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/assignment");
        setAssignments(res.data);
      } catch (err) {
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="auth-error">{error}</div>;

  return (
    <div className="playground">
      <header className="playground-header">
        <span className="header-icon"></span>
        <h1>SQL Playground</h1>
        <div className="header-user">
          <button className="back-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="assignments-page">
        <h2 className="assignments-title">Assignments</h2>
        <p className="assignments-subtitle">
          Select an assignment to start writing SQL
        </p>

        <div className="assignments-grid">
          {assignments.map((a) => (
            <button
              key={a._id}
              className="assignment-card"
              onClick={() => navigate(`/assignments/${a._id}`)}
            >
              <div className="assignment-card-header">
                <span className="assignment-card-title">{a.title}</span>
                <div className="assignment-card-badges">
                  <span className={difficultyClass[a.description]}>
                    {a.description}
                  </span>
                  <span className={statusClass[a.status]}>
                    {statusLabel[a.status]}
                  </span>
                </div>
              </div>
              <p className="assignment-card-desc">{a.question}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}