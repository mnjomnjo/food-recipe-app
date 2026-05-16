import { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Registered successfully!");
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT */}
      <div className="left-panel">
        <h1 className="app-name">MyRecipes</h1>

        <h2>Hello, Friend!</h2>
        <p>Create your account and start cooking</p>

        <Link to="/">
          <button className="ghost-btn">Sign In</button>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="right-panel">
        <form onSubmit={handleRegister} className="form-box">
          <h2>Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Register;