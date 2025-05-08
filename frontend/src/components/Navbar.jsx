import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: "#eee", padding: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
    </nav>
  );
}
