import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Favorites.css";

function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const storedFav = JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(storedFav);

    const defaultRecipes = [
      {
        _id: 1,
        title: "Chicken",
        calories: 300,
        image:
          "https://i0.wp.com/magic-stores.com/wp-content/uploads/2021/05/%D9%81%D8%B1%D9%88%D8%AC-%D9%85%D8%B4%D9%88%D9%8A.png?resize=600%2C400&ssl=1",
      },
      {
        _id: 2,
        title: "Salad",
        calories: 150,
        image:
          "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
      },
      {
        _id: 3,
        title: "Pasta",
        calories: 500,
        image:
          "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
      },
    ];

    setRecipes([...storedRecipes, ...defaultRecipes]);
  }, []);

  //  REMOVE FROM FAVORITES
  const removeFavorite = (id) => {
    const confirmRemove = window.confirm(
      "Remove this recipe from favorites?"
    );

    if (!confirmRemove) return;

    const updated = favorites.filter((fav) => fav !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const favRecipes = recipes.filter((r) => favorites.includes(r._id));

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
              <div key={recipe._id} className="card">
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={recipe.title}
                />

                <h3>{recipe.title}</h3>
                <p>{recipe.calories} Calories</p>

                {/* REMOVE BUTTON */}
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(recipe._id)}
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