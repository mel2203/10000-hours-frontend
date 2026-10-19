import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onNewPost }) {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <img className="brand-logo" src="/10000-hours-logo.png" alt="10,000 Hours" />
      <button type="button" className="new-post-btn" onClick={onNewPost}>
        + New Post
      </button>
      <nav>
        <NavLink to="/" end>
          Progress
        </NavLink>
        <NavLink to={`/profile/${userId}`}>My Profile</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
        <NavLink to="/friends">Friends</NavLink>
      </nav>
      <button type="button" className="logout-btn" onClick={handleLogout}>
        Log out
      </button>
    </aside>
  );
}
