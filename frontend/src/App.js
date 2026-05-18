// src/App.js
import "./App.css";
import "./styles/layout.css";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
}

export default App;
