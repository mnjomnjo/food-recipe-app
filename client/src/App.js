import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import AdminStats from "./pages/AdminStats";

function App() {

  // GET TOKEN
  const token = localStorage.getItem("token");

  // CHECK LOGIN
  const isAuthenticated = !!token;

  // CHECK ADMIN
  let isAdmin = false;

  try {

    if (token) {

      const decoded = jwtDecode(token);

      isAdmin =
        decoded.role === "admin";
    }

  } catch (err) {

    console.log(err);

    localStorage.removeItem("token");
  }

  return (
    <Router>

      {/* TOASTER */}
      <Toaster position="top-right" />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/home" replace />
              : <Login />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/home" replace />
              : <Register />
          }
        />

        {/* HOME */}
        <Route
          path="/home"
          element={
            isAuthenticated
              ? <Home />
              : <Navigate to="/" replace />
          }
        />

        {/* RECIPE DETAILS */}
        <Route
          path="/recipe/:id"
          element={
            isAuthenticated
              ? <RecipeDetails />
              : <Navigate to="/" replace />
          }
        />

        {/* ADD RECIPE */}
        <Route
          path="/add"
          element={
            isAuthenticated
              ? <AddRecipe />
              : <Navigate to="/" replace />
          }
        />

        {/* FAVORITES */}
        <Route
          path="/favorites"
          element={
            isAuthenticated
              ? <Favorites />
              : <Navigate to="/" replace />
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            isAuthenticated
              ? <About />
              : <Navigate to="/" replace />
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/admin/stats"
          element={
            isAuthenticated && isAdmin
              ? <AdminStats />
              : <Navigate to="/home" replace />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;