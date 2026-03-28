import {
  FaUserMd,
  FaUserInjured,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaCommentDots,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { currentUser, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <aside className={`sidebar ${collapsed ? "closed" : ""}`}>
      <div className="sidebar-top">
        <div>
          <h2>{currentUser?.role === "doctor" ? "Doctor" : "Patient"} Panel</h2>
          <p>{currentUser?.username}</p>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((p) => !p)}
        >
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        {currentUser?.role === "doctor" ? (
          <NavLink to="/doctor-dashboard" className="side-link">
            <FaUserMd />
            <span>Doctor Dashboard</span>
          </NavLink>
        ) : (
          <NavLink to="/patient-dashboard" className="side-link">
            <FaUserInjured />
            <span>Patient Dashboard</span>
          </NavLink>
        )}

        <NavLink to="/feedback" className="side-link">
          <FaCommentDots />
          <span>Feedback</span>
        </NavLink>

        <button
          type="button"
          className="side-link side-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>

        <button
          type="button"
          className="side-link side-btn danger"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}