// src/components/ThemeToggle.jsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="btn btn-secondary" onClick={toggleTheme}>
      {darkMode ? (
        <>
          <FaSun /> Light Mode
        </>
      ) : (
        <>
          <FaMoon /> Dark Mode
        </>
      )}
    </button>
  );
}