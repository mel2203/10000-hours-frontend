import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/ProgressFeed";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import "./index.css";
import AuthCallback from "./pages/AuthCallback";
import Leaderboard from "./pages/Leaderboard";
import Friends from "./pages/Friends";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Feed />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="friends" element={<Friends />} />
      </Route>
    </Routes>
  );
}
