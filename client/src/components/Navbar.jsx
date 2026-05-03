import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">MyRecipes</h2>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/add">Add Recipe</Link> {/*  NEW */}
        <button className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;