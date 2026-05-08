import Navbar from "../components/Navbar";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <div className="about-container">
        <div className="about-card">
          <h1>About MyRecipes </h1>

          <p>
            MyRecipes is a modern full-stack recipe web
            application that helps users discover, save,
            rate, and manage delicious recipes easily.
          </p>

          {/* FEATURES */}
          <div className="about-section">
            <h2> Features</h2>

            <ul>
              <li>User Authentication</li>
              <li>Add New Recipes</li>
              <li>Favorites System</li>
              <li>Recipe Rating</li>
              <li>Search & Filter Recipes</li>
              <li>Responsive Design</li>
              <li>Recipe Statistics</li>
            </ul>
          </div>

          {/* TECHNOLOGIES */}
          <div className="about-section">
            <h2> Technologies</h2>

            <p>
              React.js • Node.js • Express.js • MongoDB
            </p>
          </div>

          {/* TEAM */}
          <div className="about-section">
            <h2> Team Members</h2>

            <ul>
              <li>
                <strong>Tasnem Jned Alomr</strong> –
                Frontend Development & UI/UX
              </li>

              <li>
                <strong>Wissam Farhat</strong> –
                Backend Development
              </li>

              <li>
                <strong>Ali Mohatasim</strong> –
                Database Engineering
              </li>

              <li>
                <strong>Mohammed Nour Cuneyt Omar</strong>
                {" "}– Authentication & Security
              </li>

              <li>
                <strong>
                  Tharaki Dilshara Weththewa
                  Weththewe Kankanamge
                </strong>{" "}
                – Integration & Deployment
              </li>
            </ul>
          </div>

          {/* PROJECT */}
          <div className="about-section">
            <h2> Project Goal</h2>

            <p>
              The goal of this project is to build a
              responsive and user-friendly full-stack
              recipe management system using modern web
              technologies.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;