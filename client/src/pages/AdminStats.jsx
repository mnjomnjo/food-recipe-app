import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import Navbar from "../components/Navbar";

import "./AdminStats.css";

function AdminStats() {

  const [stats, setStats] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {

    if (isAdmin) {
      fetchStats();
    }

  }, [isAdmin]);

  // CHECK ADMIN ROLE
  const checkAdmin = () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {

        setIsAdmin(true);

      } else {

        setLoading(false);
      }

    } catch (err) {

      console.log(err);

      setLoading(false);
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

      setError("Failed to load statistics");

    } finally {

      setLoading(false);
    }
  };

  // ACCESS DENIED
  if (!loading && !isAdmin) {

    return (
      <>
        <Navbar />

        <div className="stats-container">

          <div className="message-card">

            <h2>Access Denied</h2>

            <p>Admin access only.</p>

          </div>

        </div>
      </>
    );
  }

  // LOADING
  if (loading) {

    return (
      <>
        <Navbar />

        <div className="stats-container">

          <div className="message-card">

            <h2>Loading statistics...</h2>

          </div>

        </div>
      </>
    );
  }

  // ERROR
  if (error) {

    return (
      <>
        <Navbar />

        <div className="stats-container">

          <div className="message-card">

            <h2>{error}</h2>

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="stats-container">

        <div className="stats-header">

          <h1>Admin Dashboard</h1>

          <p>
            Monitor platform statistics and application activity.
          </p>

        </div>

        <div className="stats-grid">

          <div className="stat-card">

            <h2>{stats.totalRecipes}</h2>

            <p>Total Recipes</p>

          </div>

          <div className="stat-card">

            <h2>{stats.totalUsers}</h2>

            <p>Total Users</p>

          </div>

          <div className="stat-card">

            <h2>{stats.totalFavorites}</h2>

            <p>Total Favorites</p>

          </div>

          <div className="stat-card">

            <h2>{stats.averageRating?.toFixed(1)}</h2>

            <p>Average Rating</p>

          </div>

          <div className="stat-card">

            <h2>{stats.totalRatedRecipes}</h2>

            <p>Rated Recipes</p>

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminStats;