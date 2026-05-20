import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
export default MainLayout;
