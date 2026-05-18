import RoleBasedNavigation from "../components/RoleBasedNavigation";
import "../styles/layout.css";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <RoleBasedNavigation />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
