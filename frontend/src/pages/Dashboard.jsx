
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, projectResponse, taskResponse] =
          await Promise.all([
            api.get("auth/me/"),
            api.get("projects/"),
            api.get("tasks/"),
          ]);

        setUser(userResponse.data);
        setProjects(projectResponse.data);
        setTasks(taskResponse.data);
      } catch (err) {
        setError("Unable to load dashboard information. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Welcome to Jezt Task Manager</h1>

        {user && (
          <>
            <p>
              Logged in as <strong>{user.username}</strong> | Role:{" "}
              <strong>{user.role}</strong>
            </p>

            {user.role === "ADMIN" && (
              <div className="dashboard-card">
                <h2>Admin Panel</h2>
                <p>
                  Manage projects, monitor tasks, and oversee team activity.
                </p>
              </div>
            )}

            {user.role === "MANAGER" && (
              <div className="dashboard-card">
                <h2>Manager Panel</h2>
                <p>
                  Manage projects and monitor your team's tasks.
                </p>
              </div>
            )}

            {user.role === "INTERN" && (
              <div className="dashboard-card">
                <h2>Intern Workspace</h2>
                <p>
                  View your assigned tasks and update your progress.
                </p>
              </div>
            )}
          </>
        )}

        <p>Manage your projects and track your team's progress.</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h2>Total Projects</h2>
              <h1>{projects.length}</h1>
            </div>

            <div className="dashboard-card">
              <h2>Total Tasks</h2>
              <h1>{tasks.length}</h1>
            </div>

            <div className="dashboard-card">
              <h2>Completed Tasks</h2>
              <h1>{completedTasks}</h1>
            </div>

            <div className="dashboard-card">
              <h2>Pending Tasks</h2>
              <h1>{pendingTasks}</h1>
            </div>
          </div>
        )}

        <div className="dashboard-card" style={{ marginTop: "25px" }}>
          <h2>AI Law & Policy Assistant</h2>
          <p>
            Get assistance with law and policy questions. Chatbot integration
            will be added next.
          </p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
