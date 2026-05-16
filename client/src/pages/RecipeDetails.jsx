import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // LOAD DATA
  useEffect(() => {
    fetchRecipe();
    fetchFavorites();
  }, []);

  // FETCH RECIPE
  const fetchRecipe = async () => {
    try {
      const res = await api.get("/api/recipes");

      const foundRecipe = res.data.find(
        (r) => r._id === id
      );

      setRecipe(foundRecipe);
    } catch (err) {
      console.log(err);

      toast.error("Failed to load recipe");
    }
  };

  // FETCH FAVORITES
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/recipes/favorites/my");

      const favoriteIds = res.data.map(
        (recipe) => recipe._id
      );

      setFavorites(favoriteIds);
    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE FAVORITE
  const toggleFavorite = async (id) => {
    try {
      // REMOVE FAVORITE
      if (favorites.includes(id)) {
        await api.delete(`/api/recipes/${id}/favorite`);

        const updated = favorites.filter(
          (fav) => fav !== id
        );

        setFavorites(updated);

        toast("Removed from favorites ❌");
      }

      // ADD FAVORITE
      else {
        await api.post(`/api/recipes/${id}/favorite`, {});

        const updated = [...favorites, id];

        setFavorites(updated);

        toast.success("Added to favorites ❤️");
      }
    } catch (err) {
      console.log(err);

      toast.error("Favorites update failed");
    }
  };

  // LOADING
  if (!recipe) {
    return <h2>Loading recipe...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="details-container">
        <img
          src={
            recipe.image ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={recipe.title}
        />

        <h1>{recipe.title}</h1>

        <p>{recipe.calories} Calories</p>

        <p className="desc">
          {recipe.description}
        </p>

        <button
          className="fav-btn"
          onClick={() =>
            toggleFavorite(recipe._id)
          }
          style={{
            background: favorites.includes(recipe._id)
              ? "#ff4d4d"
              : "#ff7a7a",
          }}
        >
          {favorites.includes(recipe._id)
            ? "❤️ Remove from Favorites"
            : "❤️ Add to Favorites"}
        </button>
      </div>
    </>
  );
}

export default RecipeDetails;