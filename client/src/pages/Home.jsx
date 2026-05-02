import { useState } from "react";
import "./Home.css";

function Home() {
  const [recipes] = useState([
    { _id: 1, title: "Chicken", calories: 300 },
    { _id: 2, title: "Salad", calories: 150 },
    { _id: 3, title: "Pasta", calories: 500 },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="home-container">
      <h2>Recipes</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🔥 Filter */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("low")}>Low</button>
        <button onClick={() => setFilter("medium")}>Medium</button>
        <button onClick={() => setFilter("high")}>High</button>
      </div>

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
              <h3>{recipe.title}</h3>
              <p>{recipe.calories} Calories</p>

              <button className="fav-btn">❤️</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;