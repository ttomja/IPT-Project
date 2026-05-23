import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/categoriesApi";
import { getTransactions } from "../api/stockApi";

function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, lowStock: 0, transactions: 0 });
  const [analytics, setAnalytics] = useState({
    totalValue: 0,
    healthRate: 100,
    topValued: [],
    maxVal: 1,
    catDistribution: [],
    recentActivities: []
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsRes, categoriesRes, transactionsRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getTransactions()
        ]);
        
        const products = productsRes.data || [];
        const categories = categoriesRes.data || [];
        const transactions = transactionsRes.data || [];
        
        const lowStockCount = products.filter(p => Number(p.quantityInStock) <= Number(p.reorderLevel)).length;
        const totalVal = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.quantityInStock || 0)), 0);
        const health = products.length > 0 ? Math.round(((products.length - lowStockCount) / products.length) * 100) : 100;
        
        const topValuedList = [...products]
          .map(p => ({
            ...p,
            totalVal: Number(p.price || 0) * Number(p.quantityInStock || 0)
          }))
          .sort((a, b) => b.totalVal - a.totalVal)
          .slice(0, 4);
          
        const maxValuation = topValuedList.length > 0 ? topValuedList[0].totalVal : 1;
        
        const catList = categories.map(cat => {
          const count = products.filter(p => {
            const catId = p.categoryId?._id || p.categoryId;
            return catId === cat._id;
          }).length;
          const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
          return { ...cat, count, percent };
        }).sort((a, b) => b.count - a.count).slice(0, 5);
        
        const recentList = [...transactions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setStats({
          products: products.length,
          categories: categories.length,
          lowStock: lowStockCount,
          transactions: transactions.length,
        });

        setAnalytics({
          totalValue: totalVal,
          healthRate: health,
          topValued: topValuedList,
          maxVal: maxValuation,
          catDistribution: catList,
          recentActivities: recentList
        });
      } catch (error) {
        // stats will remain at defaults if fetch fails
      }
    }
    loadStats();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(value);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Inventory Management System overview"
      />
      <div className="dashboard-grid">
        <DashboardCard
          title="Products"
          value={stats.products}
          description="Registered active products"
        />
        <DashboardCard
          title="Categories"
          value={stats.categories}
          description="Product classification groups"
        />
        <DashboardCard
          title="Low Stock"
          value={stats.lowStock}
          description="Products at or below reorder level"
        />
        <DashboardCard
          title="Transactions"
          value={stats.transactions}
          description="Recorded stock movements"
        />
      </div>

      <div className="analytics-section">
        <div className="analytics-card">
          <h2 className="analytics-card-title">Inventory Valuation</h2>
          
          <div className="asset-valuation-block">
            <div className="asset-info">
              <span className="asset-label">Total Asset Value</span>
              <span className="asset-value">{formatCurrency(analytics.totalValue)}</span>
            </div>
            <div className="health-status">
              <span className="health-percent">{analytics.healthRate}%</span>
              <div className="health-label">Stock Health</div>
            </div>
          </div>

          <div className="valuation-list">
            <h3 className="section-label">Top Products by Value</h3>
            {analytics.topValued.length === 0 ? (
              <p className="analytics-empty">No products registered yet.</p>
            ) : (
              analytics.topValued.map(prod => {
                const percentWidth = Math.max(5, Math.round((prod.totalVal / analytics.maxVal) * 100));
                return (
                  <div key={prod._id} className="valuation-item">
                    <div className="valuation-header">
                      <span className="valuation-name">
                        {prod.productName}
                        <span className="valuation-price-qty">
                          ({prod.quantityInStock} units @ {formatCurrency(prod.price)})
                        </span>
                      </span>
                      <span className="valuation-total">{formatCurrency(prod.totalVal)}</span>
                    </div>
                    <div className="valuation-bar-container">
                      <div className="valuation-bar" style={{ width: `${percentWidth}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="analytics-column">
          <div className="analytics-card">
            <h2 className="analytics-card-title">Category Distribution</h2>
            <div className="category-progress-list">
              {analytics.catDistribution.length === 0 ? (
                <p className="analytics-empty">No categories registered yet.</p>
              ) : (
                analytics.catDistribution.map(cat => (
                  <div key={cat._id} className="category-progress-item">
                    <div className="category-header">
                      <span>{cat.categoryName}</span>
                      <span className="category-stats">
                        {cat.count} products ({cat.percent}%)
                      </span>
                    </div>
                    <div className="category-bar-container">
                      <div className="category-bar" style={{ width: `${Math.max(3, cat.percent)}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="analytics-card">
            <h2 className="analytics-card-title">Recent Transactions</h2>
            <div className="timeline-list">
              {analytics.recentActivities.length === 0 ? (
                <p className="analytics-empty">No transactions recorded yet.</p>
              ) : (
                analytics.recentActivities.map(act => {
                  const isStockIn = act.transactionType === "Stock In";
                  const productName = act.productId?.productName || "Unknown Product";
                  return (
                    <div key={act._id} className="timeline-item">
                      <div className={`timeline-dot ${isStockIn ? "stock-in" : "stock-out"}`}></div>
                      <div className="timeline-content">
                        <span className="timeline-title">{act.transactionType}</span>
                        <span>: {productName} — {act.quantity} units by {act.processedBy?.fullName || "Staff"}</span>
                        <div className="timeline-time">{formatDate(act.createdAt)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
