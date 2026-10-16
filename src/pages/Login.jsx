import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/useAuth";

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
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="user_email"
          type="email"
          placeholder="Email"
          value={form.user_email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Log in</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        New here? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
