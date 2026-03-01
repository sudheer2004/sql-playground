import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    college: "",
    branch: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="header-icon"></span>
          <h1>SQL Playground</h1>
        </div>
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Start your SQL learning journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Username
            <input
              type="text"
              name="username"
              className="auth-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="At least 5 characters"
            />
          </label>
          <label className="auth-label">
            Email
            <input
              type="email"
              name="email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              name="password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, 1 uppercase, 1 special"
            />
          </label>
          <label className="auth-label">
            College
            <input
              type="text"
              name="college"
              className="auth-input"
              value={formData.college}
              onChange={handleChange}
              placeholder="Your college name"
            />
          </label>
          <label className="auth-label">
            Branch
            <input
              type="text"
              name="branch"
              className="auth-input"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Your branch"
            />
          </label>
          <button
            type="submit"
            className="btn btn--execute auth-btn"
            disabled={loading}
          >
            {loading && <span className="spinner" />}
            Sign Up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}