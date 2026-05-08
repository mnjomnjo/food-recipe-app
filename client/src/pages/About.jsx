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
            MyRecipes is a modern recipe web application
            that helps users discover, save, and manage
            delicious recipes easily.
          </p>

          <div className="about-section">
            <h2> Features</h2>

            <ul>
              <li>Add new recipes</li>
              <li>Save favorite recipes</li>
              <li>Recipe rating system</li>
              <li>Responsive modern design</li>
              <li>Recipe details page</li>
            </ul>
          </div>

          <div className="about-section">
            <h2> Technologies</h2>

            <p>
              React.js • Node.js • Express.js • MongoDB
            </p>
          </div>

          <div className="about-section">
            <h2> Team Project</h2>

            <p>
              Developed as a collaborative web development
              project.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;