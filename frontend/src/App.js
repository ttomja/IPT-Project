import "./App.css";

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Week 10 Front-End Foundation</p>
        <h1>Inventory Management System</h1>
        <p>
          This frontend project is prepared for the Inventory Management System.
          Future screens will include Login, Dashboard, Products, Categories,
          Stock-In, Stock-Out, Transactions, and Reports.
        </p>
      </section>

      <section className="module-grid">
        <div className="module-card">Authentication</div>
        <div className="module-card">Products</div>
        <div className="module-card">Categories</div>
        <div className="module-card">Stock-In</div>
        <div className="module-card">Stock-Out</div>
        <div className="module-card">Reports</div>
      </section>
    </main>
  );
}

export default App;
