import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ user_email: "", password: "" });
  const [error, setError] = useState("");
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form);
      saveAuth(data.token, data.user_id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <svg className="book-logo auth-book-logo" viewBox="0 0 40 36" aria-hidden="true">
          <path d="M20 10C15 5 8 5 3 7v22c6-2 12-1 17 4m0-23c5-5 12-5 17-3v22c-6-2-12-1-17 4m0-23v23" />
          <circle cx="20" cy="4" r="2" />
          <path d="M20 3v1l1 .6" />
        </svg>
        <p className="auth-wordmark">10,000 Hours</p>
        <p className="auth-tagline">A little progress, every day.</p>
      </section>
      <section className="auth-card">
        <h1 className="page-title">Welcome back</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          name="user_email"
          type="email"
          placeholder="Email"
          value={form.user_email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
          <button className="primary-button" type="submit">Log in</button>
        </form>
        {error && <p className="state-message error-state">{error}</p>}
        <p className="auth-switch">
          New here? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
