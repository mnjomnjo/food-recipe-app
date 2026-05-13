import { useState } from "react";

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
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} autoComplete="off">
        <input
          type="email"
          placeholder="Email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;