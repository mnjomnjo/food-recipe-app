import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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

    const storedFav =
      JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(storedFav);
  }, []);

  // FETCH RECIPE FROM BACKEND
  const fetchRecipe = async () => {
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

      const foundRecipe = res.data.find(
        (r) => r._id === id
      );

      setRecipe(foundRecipe);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load recipe");
    }
  };

  // FAVORITE LOGIC
  const toggleFavorite = (id) => {
    let updated;

    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);

      toast("Removed from favorites ❌");
    } else {
      updated = [...favorites, id];

      toast.success("Added to favorites ❤️");
    }

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
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