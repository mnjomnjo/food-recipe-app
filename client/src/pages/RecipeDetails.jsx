import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();

  const [favorites, setFavorites] = useState([]);

  //  LOAD FAVORITES
  useEffect(() => {
    const storedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFav);
  }, []);

  //  DATA (same as Home + localStorage)
  const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

  const defaultRecipes = [
    {
      _id: 1,
      title: "Chicken",
      calories: 300,
      image:
        "https://i0.wp.com/magic-stores.com/wp-content/uploads/2021/05/%D9%81%D8%B1%D9%88%D8%AC-%D9%85%D8%B4%D9%88%D9%8A.png?resize=600%2C400&ssl=1",
      description: "Delicious grilled chicken with spices.",
    },
    {
      _id: 2,
      title: "Salad",
      calories: 150,
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
      description: "Fresh healthy salad.",
    },
    {
      _id: 3,
      title: "Pasta",
      calories: 500,
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
      description: "Creamy pasta with sauce.",
    },
  ];

  const recipes = [...storedRecipes, ...defaultRecipes];

  const recipe = recipes.find((r) => r._id === Number(id));

  if (!recipe) return <h2>Recipe not found</h2>;

  //  FAVORITE LOGIC
  const toggleFavorite = (id) => {
    let updated;

    if (!favorites.includes(id)) {
      const confirmAdd = window.confirm(
        "Add this recipe to favorites?"
      );
      if (!confirmAdd) return;
    }

    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);
    } else {
      updated = [...favorites, id];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

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

        <p className="desc">{recipe.description}</p>

        <button
          className="fav-btn"
          onClick={() => toggleFavorite(recipe._id)}
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