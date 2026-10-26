
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    try {
      const response = await api.get("projects/");
      setProjects(response.data);
      setError("");
    } catch (err) {
      setError("Could not load projects. Please log in again if your session expired.");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("projects/", { name, description });
      setName("");
      setDescription("");
      setMessage("Project created successfully!");
      loadProjects();
    } catch (err) {
      setError("Could not create project. Check that you have permission.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Projects</h1>
        <p>Create and manage your projects.</p>

        <div className="dashboard-card">
          <h2>Create a Project</h2>
          <form onSubmit={createProject}>
            <label>Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={3}
            />

            <button type="submit">Create Project</button>
          </form>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <h2>Your Projects</h2>

        {projects.length === 0 ? (
          <p>No projects found yet.</p>
        ) : (
          <div className="dashboard-cards">
            {projects.map((project) => (
              <div className="dashboard-card" key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description || "No description provided."}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
