import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";

function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Inventory Management System overview"
      />
      <div className="dashboard-grid">
        <DashboardCard
          title="Products"
          value="0"
          description="Registered active products"
        />
        <DashboardCard
          title="Categories"
          value="0"
          description="Product classification groups"
        />
        <DashboardCard
          title="Low Stock"
          value="0"
          description="Products at or below reorder level"
        />
        <DashboardCard
          title="Transactions"
          value="0"
          description="Recorded stock movements"
        />
      </div>
    </div>
  );
}
export default DashboardPage;
