import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recipes</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
            }}
          >
            <h4>{recipe.title}</h4>
            <p>Calories: {recipe.calories}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;