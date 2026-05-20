function DashboardCard({ title, value, description }) {
  return (
    <div className="dashboard-card">
      <p className="card-title">{title}</p>
      <h3>{value}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
}
export default DashboardCard;
