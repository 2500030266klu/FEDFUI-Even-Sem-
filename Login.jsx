import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    const result = login(username, password, role);

    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success("Logged in successfully");
    if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-head">
          <h2>Welcome back</h2>
          <p>Log in to manage appointments.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary full-width">
            Login
          </button>
        </form>

        <p className="toggle-text">
          New here?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}