import { useState } from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      toast.success(
        "Registered successfully ✅"
      );

      navigate("/");

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Registration failed"
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

        <h2>Hello, Friend!</h2>

        <p>
          Create your account and start cooking
        </p>

        <Link to="/">
          <button className="ghost-btn">
            Sign In
          </button>
        </Link>

      </div>

      {/* RIGHT */}
      <div className="right-panel">

        <form
          onSubmit={handleRegister}
          className="form-box"
        >

          <h2>Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

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
              ? "Creating account..."
              : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;