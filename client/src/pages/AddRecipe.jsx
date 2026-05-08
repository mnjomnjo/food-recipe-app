import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./AddRecipe.css";

function AddRecipe() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    calories: "",
    image: "",
    description: "",
    ingredients: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD RECIPE TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.calories) {
      toast.error("Please fill required fields ⚠️");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const recipeData = {
        title: formData.title,
        description: formData.description,
        calories: Number(formData.calories),
        image:
          formData.image ||
          "https://via.placeholder.com/300x200?text=No+Image",

        ingredients: formData.ingredients
          ? formData.ingredients.split(",")
          : [],

        instructions: formData.instructions,
      };

      await axios.post(
        "http://localhost:5000/api/recipes",
        recipeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Recipe added successfully ✅");

      navigate("/home");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add recipe ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-container">
        <h2>Add New Recipe</h2>

        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            name="title"
            placeholder="Recipe Name"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <textarea
            name="ingredients"
            placeholder="Ingredients separated by commas"
            value={formData.ingredients}
            onChange={handleChange}
          />

          <textarea
            name="instructions"
            placeholder="Cooking Instructions"
            value={formData.instructions}
            onChange={handleChange}
          />

          <button type="submit">
            Add Recipe
          </button>
        </form>
      </div>
    </>
  );
}

export default AddRecipe;