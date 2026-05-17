import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./AdminStats.css";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, []);

  // CHECK ADMIN ROLE
  const checkAdmin = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/recipes/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // NOT ADMIN
  if (!isAdmin) {
    return (
      <>
        <Navbar />

        <div className="stats-container">
          <h2>Access Denied </h2>
          <p>Admin access only.</p>
        </div>
      </>
    );
  }

  // LOADING
  if (!stats) {
    return (
      <>
        <Navbar />

        <div className="stats-container">
          <h2>Loading statistics...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="stats-container">
        <h1>Admin Statistics </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>{stats.totalRecipes}</h2>
            <p>Total Recipes</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalUsers}</h2>
            <p>Total Users</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminStats;