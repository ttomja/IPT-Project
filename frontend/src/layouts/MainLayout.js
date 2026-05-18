// src/layouts/MainLayout.js
function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h2>Inventory Management System</h2>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
export default MainLayout;
