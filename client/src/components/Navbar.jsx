import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  let isAdmin = false;

  try {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
    }
  } catch {
    localStorage.removeItem("token");
  }

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully ✅");

    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h2 className="logo">MyRecipes</h2>

      <div className="nav-links">

        <Link to="/home">
          Home
        </Link>

        <Link to="/favorites">
          Favorites
        </Link>

        <Link to="/add">
          Add Recipe
        </Link>

        <Link to="/about">
          About
        </Link>

        {isAdmin && (
          <Link to="/admin/stats">
            Admin Stats
          </Link>
        )}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;