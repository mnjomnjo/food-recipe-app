import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
      });

      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;