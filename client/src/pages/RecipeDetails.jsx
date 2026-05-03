import { useParams } from "react-router-dom";
import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();

  // (Home)
  const recipes = [
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

  const recipe = recipes.find((r) => r._id === Number(id));

  if (!recipe) return <h2>Recipe not found</h2>;

  return (
    <div className="details-container">
      <img src={recipe.image} alt={recipe.title} />

      <h1>{recipe.title}</h1>

      <p>{recipe.calories} Calories</p>

      <p className="desc">{recipe.description}</p>

      <button className="fav-btn">❤️ Add to Favorites</button>
    </div>
  );
}

export default RecipeDetails;