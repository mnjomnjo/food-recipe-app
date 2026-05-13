import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [ratings, setRatings] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD DATA
  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  // FETCH RECIPES
  const fetchRecipes = async () => {
    try {
      setLoading(true);

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

      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

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

      // SAVE ONLY FAVORITE IDS
      const favoriteIds = res.data.map(
        (recipe) => recipe._id
      );

      setFavorites(favoriteIds);
    } catch (err) {
      console.log(err);
    }
  };

  // RATING
  const handleRating = async (id, rating) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/recipes/${id}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // UPDATE LOCAL STATE
      setRatings({
        ...ratings,
        [id]: rating,
      });

      // UPDATE RECIPES STATE
      const updatedRecipes = recipes.map((recipe) =>
        recipe._id === id
          ? { ...recipe, rating }
          : recipe
      );

      setRecipes(updatedRecipes);

      toast.success("Recipe rated ⭐");
    } catch (err) {
      toast.error("Rating failed");
    }
  };

  // FAVORITES
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
  };

  // DELETE RECIPE
  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/recipes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = recipes.filter(
        (r) => r._id !== id
      );

      setRecipes(updated);

      toast.error("Recipe deleted 🗑️");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // FILTERED RECIPES
  const filteredRecipes = recipes
    .filter((r) =>
      r.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((r) => {
      if (filter === "low") return r.calories < 200;

      if (filter === "medium") {
        return (
          r.calories >= 200 &&
          r.calories <= 400
        );
      }

      if (filter === "high") return r.calories > 400;

      return true;
    });

  // STATS
  const totalRecipes = recipes.length;

  const avgCalories =
    recipes.length > 0
      ? Math.round(
          recipes.reduce(
            (sum, r) => sum + r.calories,
            0
          ) / recipes.length
        )
      : 0;

  return (
    <>
      <Navbar />

      <div className="home-container">
        <div className="hero">
          <h1>Discover Recipes</h1>

          <p>
            Find your favorite meals easily
          </p>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-box">
            <h3>{totalRecipes}</h3>

            <p>Total Recipes</p>
          </div>

          <div className="stat-box">
            <h3>{avgCalories}</h3>

            <p>Avg Calories</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* FILTER */}
        <div className="filter-buttons">
          {["all", "low", "medium", "high"].map(
            (type) => (
              <button
                key={type}
                className={
                  filter === type ? "active" : ""
                }
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            )
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <h2 className="loading-text">
            Loading recipes...
          </h2>
        ) : filteredRecipes.length === 0 ? (
          <h2 className="empty-text">
            No recipes found
          </h2>
        ) : (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="card"
                onClick={() =>
                  navigate(`/recipe/${recipe._id}`)
                }
              >
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={recipe.title}
                />

                <h3>{recipe.title}</h3>

                <p>
                  {recipe.calories} Calories
                </p>

                {/* FAVORITES */}
                <button
                  className="fav-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleFavorite(recipe._id);
                  }}
                  style={{
                    color: favorites.includes(
                      recipe._id
                    )
                      ? "red"
                      : "#999",
                  }}
                >
                  ❤️
                </button>

                {/* RATING */}
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={(e) => {
                        e.stopPropagation();

                        handleRating(
                          recipe._id,
                          star
                        );
                      }}
                      style={{
                        color:
                          (
                            ratings[
                              recipe._id
                            ] || recipe.rating
                          ) >= star
                            ? "gold"
                            : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* DELETE */}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteRecipe(recipe._id);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;