import { Link } from "react-router-dom";

export default function ToggleAuth({ type }) {
  return (
    <p className="toggle-text">
      {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
      <Link to={type === "login" ? "/register" : "/login"}>
        {type === "login" ? "Register" : "Login"}
      </Link>
    </p>
  );
}