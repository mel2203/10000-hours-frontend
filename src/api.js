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

 if (res.status === 403 && data.error === "Invalid token") {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login"; // Redirect to login page
    throw new Error("Session expired. Please log in again.");
 }
 //if not ok show error message
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const signup = (body) =>
  request("/signup", { method: "POST", body: JSON.stringify(body) });

export const login = (body) =>
  request("/login", { method: "POST", body: JSON.stringify(body) });

export const createProfile = (body) =>
  request("/profiles", { method: "POST", body: JSON.stringify(body) });

export const getPosts = () => request("/posts");

export const getSkills = () => request("/skills");

export const getMyStats = () => request("/stats/me");

export const getLeaderboard = (skill) =>
  request(`/leaderboard${skill ? `?skill=${encodeURIComponent(skill)}` : ""}`);

export const getProfile = (userId) => request(`/profiles/${userId}`);

export const updateProfile = (body) =>
  request("/profiles", { method: "PATCH", body: JSON.stringify(body) });

export const getFriends = () => request("/friends");

export const getFriendRequests = () => request("/friend/requests");

export const sendFriendRequest = (friend_id) =>
  request("/friend", { method: "POST", body: JSON.stringify({ friend_id }) });

export const acceptFriendRequest = (friend_id) =>
  request("/friend/accept", { method: "PATCH", body: JSON.stringify({ friend_id }) });

export const removeFriend = (friend_id) =>
  request(`/friend/${friend_id}`, { method: "DELETE" });

export const searchProfiles = (query) =>
  request(`/profiles?search=${encodeURIComponent(query)}`);

export const createPost = (body) =>
  request("/posts", { method: "POST", body: JSON.stringify(body) });

export async function uploadImage(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data.image_url;
}

export const googleLogin = (access_token) =>
  request("/auth/google", { method: "POST", body: JSON.stringify({ access_token }) });
