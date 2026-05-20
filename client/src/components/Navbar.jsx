import { Link, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import axios from "axios";

import toast from "react-hot-toast";

import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  // GET TOKEN
  const token =
    localStorage.getItem("token");

  // CHECK ADMIN
  let isAdmin = false;

  try {

    if (token) {

      const decoded =
        jwtDecode(token);

      isAdmin =
        decoded.role === "admin";
    }

  } catch (err) {

    console.log(err);
  }

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

        {/* ADMIN ONLY */}
        {
          isAdmin && (

            <Link to="/admin/stats">
              Admin Stats
            </Link>
          )
        }

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