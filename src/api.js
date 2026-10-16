const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const signup = (body) =>
  request("/signup", { method: "POST", body: JSON.stringify(body) });

export const login = (body) =>
  request("/login", { method: "POST", body: JSON.stringify(body) });

export const createProfile = (body) =>
  request("/profiles", { method: "POST", body: JSON.stringify(body) });
