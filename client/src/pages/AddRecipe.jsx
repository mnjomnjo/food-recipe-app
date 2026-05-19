import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import Navbar from "../components/Navbar";

import toast from "react-hot-toast";

import "./AddRecipe.css";

function AddRecipe() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      calories: "",
      category: "",
      image: "",
      description: "",
      ingredients: "",
      instructions: "",
    });

  // HANDLE INPUTS
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ADD RECIPE
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.title ||
      !formData.calories ||
      !formData.category
    ) {

      toast.error(
        "Please fill all required fields ⚠️"
      );

      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const recipeData = {

        title: formData.title,

        description:
          formData.description,

        calories: Number(
          formData.calories
        ),

        category:
          formData.category,

        image:
          formData.image ||
          "https://via.placeholder.com/300x200?text=No+Image",

        ingredients:
          formData.ingredients
            ? formData.ingredients
                .split(",")
                .map((item) =>
                  item.trim()
                )
            : [],

        instructions:
          formData.instructions,
      };

      await axios.post(
        "http://localhost:5000/api/recipes",
        recipeData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Recipe added successfully ✅"
      );

      navigate("/home");

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to add recipe ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-container">

        <h2>Add New Recipe</h2>

        <form
          onSubmit={handleSubmit}
          className="add-form"
        >

          {/* TITLE */}
          <input
            type="text"
            name="title"
            placeholder="Recipe Name"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* CALORIES */}
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Category
            </option>

            <option value="breakfast">
              Breakfast
            </option>

            <option value="lunch">
              Lunch
            </option>

            <option value="dinner">
              Dinner
            </option>

            <option value="dessert">
              Dessert
            </option>

          </select>

          {/* IMAGE */}
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* INGREDIENTS */}
          <textarea
            name="ingredients"
            placeholder="Ingredients separated by commas"
            value={formData.ingredients}
            onChange={handleChange}
          />

          {/* INSTRUCTIONS */}
          <textarea
            name="instructions"
            placeholder="Cooking Instructions"
            value={formData.instructions}
            onChange={handleChange}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Adding Recipe..."
              : "Add Recipe"}

          </button>

        </form>
      </div>
    </>
  );
}

export default AddRecipe;