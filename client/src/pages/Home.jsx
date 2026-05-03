import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const [recipes] = useState([
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
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [ratings, setRatings] = useState({});
  const [favorites, setFavorites] = useState([]);

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        {/* HERO */}
        <div className="hero">
          <h1>Discover Recipes </h1>
          <p>Find your favorite meals easily</p>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "low" ? "active" : ""}
            onClick={() => setFilter("low")}
          >
            Low
          </button>

          <button
            className={filter === "medium" ? "active" : ""}
            onClick={() => setFilter("medium")}
          >
            Medium
          </button>

          <button
            className={filter === "high" ? "active" : ""}
            onClick={() => setFilter("high")}
          >
            High
          </button>
        </div>

        {/* CARDS */}
        <div className="recipes-grid">
          {recipes
            .filter((recipe) =>
              recipe.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter((recipe) => {
              if (filter === "low") return recipe.calories < 200;
              if (filter === "medium")
                return recipe.calories >= 200 && recipe.calories <= 400;
              if (filter === "high") return recipe.calories > 400;
              return true;
            })
            .map((recipe) => (
              <div key={recipe._id} className="card">
                <img src={recipe.image} alt={recipe.title} />

                <h3>{recipe.title}</h3>
                <p>{recipe.calories} Calories</p>

                {/*  FAVORITE */}
                <button
                  className="fav-btn"
                  onClick={() => toggleFavorite(recipe._id)}
                  style={{
                    color: favorites.includes(recipe._id)
                      ? "red"
                      : "#999",
                  }}
                >
                  ❤️
                </button>

                {/*  RATING */}
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRating(recipe._id, star)}
                      style={{
                        color:
                          ratings[recipe._id] >= star ? "gold" : "#ccc",
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Home;