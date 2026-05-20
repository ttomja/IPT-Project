import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/categoriesApi";
import { getTransactions } from "../api/stockApi";

function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, lowStock: 0, transactions: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsRes, categoriesRes, transactionsRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getTransactions()
        ]);
        
        const products = productsRes.data || [];
        const lowStockCount = products.filter(p => Number(p.quantityInStock) <= Number(p.reorderLevel)).length;

        setStats({
          products: products.length,
          categories: categoriesRes.data?.length || 0,
          lowStock: lowStockCount,
          transactions: transactionsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    }
    loadStats();
  }, []);

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
    </div>
  );
}
export default DashboardPage;
