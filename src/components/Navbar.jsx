import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="site-nav">
      <Link className="site-logo" to="/">
        <svg className="book-logo" viewBox="0 0 40 36" aria-hidden="true">
          <path d="M20 10C15 5 8 5 3 7v22c6-2 12-1 17 4m0-23c5-5 12-5 17-3v22c-6-2-12-1-17 4m0-23v23" />
          <circle cx="20" cy="4" r="2" />
          <path d="M20 3v1l1 .6" />
        </svg>
        <span>10,000 Hours</span>
      </Link>
      <div className="nav-links">
        <NavLink className="nav-pill" to="/">Progress</NavLink>
        <NavLink className="nav-pill" to={`/profile/${userId}`}>My Profile</NavLink>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
