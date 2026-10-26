
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("token/", {
        username: username.trim(),
        password,
      });

      const { access, refresh } = response.data;

      if (!access) {
        setError("Login failed: the backend did not return an access token.");
        return;
      }

      localStorage.setItem("access", access);

      if (refresh) {
        localStorage.setItem("refresh", refresh);
      }

      const tokenSaved = Boolean(localStorage.getItem("access"));
      console.log("Access token saved:", tokenSaved);

      if (!tokenSaved) {
        setError("Unable to save your login session. Please try again.");
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Login request failed:",
        err.response?.status,
        err.response?.data || err.message
      );

      if (!err.response) {
        setError(
          "Cannot connect to the backend. Make sure Django is running."
        );
      } else if (err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError(
          err.response.data?.detail ||
            "Login failed. Please check the backend and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>
        <p>Sign in to your Jezt Task Manager account</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
