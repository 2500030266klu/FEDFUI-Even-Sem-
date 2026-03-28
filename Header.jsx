import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaHospital } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <FaHospital />
        </div>
        <div>
          <h1>CareBook Pro</h1>
          <p>Modern appointment system</p>
        </div>
      </div>

      {currentUser && (
        <div className="header-user">
          <span>{currentUser.role === "doctor" ? "Dr." : ""} {currentUser.username}</span>
        </div>
      )}
    </header>
  );
}