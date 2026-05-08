import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully ✅");

    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">MyRecipes</h2>

      <div className="nav-links">
        <Link to="/home">Home</Link>

        <Link to="/favorites">
          Favorites
        </Link>

        <Link to="/add">
          Add Recipe
        </Link>

        <Link to="/about">
          About
        </Link>

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