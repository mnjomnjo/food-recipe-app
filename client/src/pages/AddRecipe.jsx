import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AddRecipe.css";

function AddRecipe() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    calories: "",
    image: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //  VALIDATION
    if (!formData.title || !formData.calories) {
      alert("Please fill required fields");
      return;
    }

    const newRecipe = {
      ...formData,
      calories: Number(formData.calories),
      image:
        formData.image ||
        "https://via.placeholder.com/300x200?text=No+Image",
      _id: Date.now(),
    };

    const existing = JSON.parse(localStorage.getItem("recipes")) || [];

    localStorage.setItem(
      "recipes",
      JSON.stringify([newRecipe, ...existing])
    );

    navigate("/home");
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
            required
          />

          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
            required
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

          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </>
  );
}

export default AddRecipe;