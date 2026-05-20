import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getUser, logout } from "../utils/auth";

function MainLayout({ children }) {
  const navigate = useNavigate();
  const user = getUser();
  
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <strong>{user?.fullName || "User"}</strong>
            <span> | {user?.role}</span>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
export default MainLayout;
