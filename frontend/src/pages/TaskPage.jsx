
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        api.get("tasks/"),
        api.get("projects/"),
      ]);

      setTasks(taskResponse.data);
      setProjects(projectResponse.data);
      setError("");
    } catch (err) {
      setError("Could not load tasks or projects. Please check your login.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("tasks/", {
        title,
        description,
        project: Number(project),
        deadline: deadline || null,
        status: "TODO",
      });

      setTitle("");
      setDescription("");
      setProject("");
      setDeadline("");
      setMessage("Task created successfully!");

      await loadData();
    } catch (err) {
      setError(
        "Could not create task. Check your permissions and project selection."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`tasks/${taskId}/`, {
        status: newStatus,
      });

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setMessage("Task status updated successfully!");
    } catch (err) {
      setError("Could not update task status. Check your permissions.");
      await loadData();
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Tasks</h1>
        <p>Create tasks, track deadlines, and update progress.</p>

        <div className="dashboard-card">
          <h2>Create a Task</h2>

          {projects.length === 0 ? (
            <p>Create a project first, then you can add tasks.</p>
          ) : (
            <form onSubmit={createTask}>
              <label>Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                required
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the task"
                rows={3}
              />

              <label>Project</label>
              <select
                value={project}
                onChange={(event) => setProject(event.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </button>
            </form>
          )}

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <h2 style={{ marginTop: "30px" }}>Your Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks found yet.</p>
        ) : (
          <div className="dashboard-cards">
            {tasks.map((task) => (
              <div className="dashboard-card" key={task.id}>
                <h3>{task.title}</h3>

                <p>
                  {task.description || "No description provided."}
                </p>

                <p>
                  <strong>Project:</strong>{" "}
                  {projects.find((item) => item.id === task.project)?.name ||
                    "Project"}
                </p>

                <p>
                  <strong>Deadline:</strong>{" "}
                  {task.deadline || "Not set"}
                </p>

                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <label>Update Status</label>
                <select
                  value={task.status}
                  onChange={(event) =>
                    updateTaskStatus(task.id, event.target.value)
                  }
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TaskPage;
