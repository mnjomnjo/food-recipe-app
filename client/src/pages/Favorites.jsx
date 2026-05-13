import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // LOAD FAVORITES FROM BACKEND
  useEffect(() => {
    fetchFavorites();
  }, []);

  // FETCH FAVORITES
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/recipes/favorites/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(res.data);
    } catch (err) {
      console.log(err);

      toast.error("Failed to load favorites");
    }
  };

  // REMOVE FAVORITE
  const removeFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/recipes/${id}/favorite`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = favorites.filter(
        (recipe) => recipe._id !== id
      );

      setFavorites(updated);

      toast("Removed from favorites ❌");
    } catch (err) {
      console.log(err);

      toast.error("Failed to remove favorite");
    }
  };

  return (
    <>
      <Navbar />

      <div className="favorites-container">
        <h2>My Favorite Recipes ❤️</h2>

        <div className="recipes-grid">
          {favorites.length === 0 ? (
            <p>No favorites yet 😢</p>
          ) : (
            favorites.map((recipe) => (
              <div
                key={recipe._id}
                className="card"
              >
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={recipe.title}
                />

                <h3>{recipe.title}</h3>

                <p>
                  {recipe.calories} Calories
                </p>

                {/* REMOVE BUTTON */}
                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFavorite(recipe._id)
                  }
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Favorites;