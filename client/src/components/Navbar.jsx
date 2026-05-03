import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">MyRecipes</h2>

      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/favorites">Favorites</a>
        <button className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;