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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log(data);

      // save token
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        alert("Login successful");
      } else {
        alert("Login failed");
      }

    } catch (err) {
      console.log(err);
    }
  };

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