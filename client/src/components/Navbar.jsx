import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import toast from "react-hot-toast";

import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = async () => {

    try {

      // Call backend logout route
      await axios.post(
        "http://localhost:5000/api/auth/logout"
      );

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Remove user data
      localStorage.removeItem("user");

      // Success notification
      toast.success(
        "Logged out successfully ✅"
      );

      // Redirect to login page
      navigate("/");

    } catch (err) {

      console.log(err);

      toast.error(
        "Logout failed ❌"
      );
    }
  };

  return (
    <nav className="navbar">

      <h2 className="logo">
        MyRecipes
      </h2>

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

        <Link to="/admin/stats">
          Admin Stats
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