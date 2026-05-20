import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import "../styles/layout.css";

function RoleBasedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "Administrator" || user.role === "Admin";

  function NavLink({ to, icon, label }) {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`sidebar-link${isActive ? " active" : ""}`}>
        <span className="sidebar-link-icon">{icon}</span>
        <span className="sidebar-link-label">{label}</span>
      </Link>
    );
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">📦</span>
        <span className="sidebar-brand-text">IMS</span>
      </div>

      {/* User Info */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-profile-info">
          <p className="sidebar-user">{user.fullName}</p>
          <p className="sidebar-role">{user.role}</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        <NavLink to="/dashboard" icon="📊" label="Dashboard" />

        {isAdmin && (
          <>
            <span className="sidebar-section-label">Management</span>
            <NavLink to="/users" icon="👥" label="Users" />
            <NavLink to="/categories" icon="🏷️" label="Categories" />
          </>
        )}

        <span className="sidebar-section-label">Inventory</span>
        <NavLink to="/products" icon="📋" label="Products" />
        <NavLink to="/stock-in" icon="📥" label="Stock-In" />
        <NavLink to="/stock-out" icon="📤" label="Stock-Out" />

        <span className="sidebar-section-label">Records</span>
        <NavLink to="/transactions" icon="🔄" label="Transactions" />
        <NavLink to="/reports" icon="📈" label="Reports" />
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <span className="sidebar-link-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default RoleBasedNavigation;
