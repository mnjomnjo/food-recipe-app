import { useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import "./Auth.css";

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success(
        "Login successful ✅"
      );

      // REFRESH APP
      window.location.href = "/home";

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Login failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* LEFT */}
      <div className="left-panel">

        <h1 className="app-name">
          MyRecipes
        </h1>

        <h2>Welcome Back!</h2>

        <p>
          Login to continue exploring recipes
        </p>

        <Link to="/register">

          <button className="ghost-btn">
            Sign Up
          </button>

        </Link>

      </div>

      {/* RIGHT */}
      <div className="right-panel">

        <form
          onSubmit={handleLogin}
          className="form-box"
        >

          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;