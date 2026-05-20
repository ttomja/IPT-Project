import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import "../styles/layout.css";

/* Minimal inline SVG icons – clean, consistent stroke style */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  categories: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3L8 21" />
      <path d="M16 3l-2 18" />
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  stockIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 3 12 15" />
      <polyline points="8 11 12 15 16 11" />
      <path d="M20 21H4" />
    </svg>
  ),
  stockOut: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 15 12 3" />
      <polyline points="8 7 12 3 16 7" />
      <path d="M20 21H4" />
    </svg>
  ),
  transactions: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  reports: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

function Sidebar() {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Administrator" || user?.role === "Admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

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
        <svg className="sidebar-brand-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span className="sidebar-brand-text">IMS</span>
      </div>

      {/* User Info */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.fullName?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="sidebar-profile-info">
          <p className="sidebar-user">{user?.fullName || "User"}</p>
          <p className="sidebar-role">{user?.role}</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        <NavLink to="/dashboard" icon={icons.dashboard} label="Dashboard" />

        {isAdmin && (
          <>
            <span className="sidebar-section-label">Management</span>
            <NavLink to="/users" icon={icons.users} label="Users" />
            <NavLink to="/categories" icon={icons.categories} label="Categories" />
          </>
        )}

        <span className="sidebar-section-label">Inventory</span>
        <NavLink to="/products" icon={icons.products} label="Products" />
        <NavLink to="/stock-in" icon={icons.stockIn} label="Stock-In" />
        <NavLink to="/stock-out" icon={icons.stockOut} label="Stock-Out" />

        <span className="sidebar-section-label">Records</span>
        <NavLink to="/transactions" icon={icons.transactions} label="Transactions" />
        <NavLink to="/reports" icon={icons.reports} label="Reports" />
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          {icons.logout}
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
