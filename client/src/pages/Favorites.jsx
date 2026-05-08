import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./Favorites.css";

function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // LOAD FAVORITES + RECIPES
  useEffect(() => {
    fetchRecipes();

    const storedFav =
      JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(storedFav);
  }, []);

  // GET RECIPES FROM BACKEND
  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/recipes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load favorites");
    }
  };

  // REMOVE FROM FAVORITES
  const removeFavorite = (id) => {
    const updated = favorites.filter(
      (fav) => fav !== id
    );

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    toast("Removed from favorites ❌");
  };

  // FILTER FAVORITE RECIPES
  const favRecipes = recipes.filter((r) =>
    favorites.includes(r._id)
  );

  return (
    <>
      <Navbar />

      <div className="favorites-container">
        <h2>My Favorite Recipes ❤️</h2>

        <div className="recipes-grid">
          {favRecipes.length === 0 ? (
            <p>No favorites yet 😢</p>
          ) : (
            favRecipes.map((recipe) => (
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