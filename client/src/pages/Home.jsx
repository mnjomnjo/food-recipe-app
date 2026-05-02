import { useState } from "react";
import "./Home.css";

function Home() {
  const [recipes] = useState([
    { _id: 1, title: "Chicken", calories: 300 },
    { _id: 2, title: "Salad", calories: 150 },
    { _id: 3, title: "Pasta", calories: 500 },
  ]);

  return (
    <div className="home-container">
      <h2>Recipes</h2>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
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