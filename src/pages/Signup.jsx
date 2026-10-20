import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, createProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    user_email: "",
    password: "",
    username: "",
  });
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
      const data = await signup({
        user_email: form.user_email,
        password: form.password,
      });
      saveAuth(data.token, data.user_id); // save first so the next request has the token
      await createProfile({ username: form.username });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <img
          className="auth-logo"
          src="/10000-hours-logo.png"
          alt="10,000 Hours"
        />
      </section>
      <section className="auth-card">
        <h1 className="page-title">Sign up</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
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
          <button className="primary-button" type="submit">Create account</button>
        </form>
        {error && <p className="state-message error-state">{error}</p>}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
