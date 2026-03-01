import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/assignments");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue practicing SQL</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Username or Email
            <input
              type="text"
              name="identifier"
              className="auth-input"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Username or email"
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
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="btn btn--execute auth-btn"
            disabled={loading}
          >
            {loading && <span className="spinner" />}
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}