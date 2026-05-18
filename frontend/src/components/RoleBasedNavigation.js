import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import "../styles/layout.css";

function RoleBasedNavigation() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <aside className="sidebar">
      <h2>IMS</h2>
      <p className="sidebar-user">{user.fullName}</p>
      <p className="sidebar-role">{user.role}</p>
      <nav>
        {user.role === "Admin" && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/admin/users">User Management</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/products">Products</Link>
          </>
        )}
        {user.role === "Staff" && (
          <>
            <Link to="/staff">Staff Dashboard</Link>
            <Link to="/staff/products">View Products</Link>
            <Link to="/staff/stock-in">Stock-In</Link>
            <Link to="/staff/stock-out">Stock-Out</Link>
          </>
        )}
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default RoleBasedNavigation;
