import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import Favorites from "./pages/Favorites";
import About from "./pages/About";

function App() {
  return (
    <Router>
      {/* Toast Container */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route path="/home" element={<Home />} />

        <Route
          path="/recipe/:id"
          element={<RecipeDetails />}
        />

        <Route path="/add" element={<AddRecipe />} />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;