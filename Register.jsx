import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !name) {
      setError("Please fill all fields");
      return;
    }

    const result = register({ username, password, role, name });

    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success("Account created successfully");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-head">
          <h2>Create account</h2>
          <p>Sign up to start booking or managing appointments.</p>
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
            <label>Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary full-width">
            Register
          </button>
        </form>

        <p className="toggle-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}