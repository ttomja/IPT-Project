import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { saveSession } from "../utils/auth";
import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      return "Username is required.";
    }
    if (!formData.password.trim()) {
      return "Password is required.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser(formData);
      saveSession({
        token: data.token,
        user: data.user,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Inventory Management System</h1>
        <p className="login-subtitle">Sign in to continue</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="login-credentials-toggle">
          <button 
            type="button" 
            className="toggle-credentials-btn" 
            onClick={() => setShowCredentials(!showCredentials)}
          >
            {showCredentials ? "Hide System Credentials" : "Show System Credentials"}
          </button>
        </div>
        {showCredentials && (
          <div className="login-test-accounts fade-in">
            <strong>System Credentials:</strong>
            <p>Admin: <code>admin</code> / <code>admin123</code></p>
            <p>Staff: <code>staff</code> / <code>staff123</code></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
