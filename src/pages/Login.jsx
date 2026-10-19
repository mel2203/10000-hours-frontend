import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [form, setForm] = useState({ user_email: "", password: "" });
  const [error, setError] = useState("");
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleGoogle() {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
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
    <div className="auth-page">
      <section className="auth-brand">
        <img
          className="auth-logo"
          src="/10000-hours-logo.png"
          alt="10,000 Hours"
        />
      </section>
      <section className="auth-card">
        <h1 className="page-title">Welcome back, learner.</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            name="user_email"
            type="email"
            placeholder="Please enter your email"
            value={form.user_email}
            onChange={handleChange}
          />
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="Please enter your password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="primary-button" type="submit">
            Log in
          </button>
          <button type="button" onClick={handleGoogle}>
            Continue with Google
          </button>
        </form>
        {error && <p className="state-message error-state">{error}</p>}
        <p className="auth-switch">
          New here? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </div>
  );
}
