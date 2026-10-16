import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, createProfile } from "../api";
import { useAuth } from "../context/useAuth";

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
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
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
        <button type="submit">Create account</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
