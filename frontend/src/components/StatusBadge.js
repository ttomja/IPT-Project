function StatusBadge({ status }) {
  const className = status === "Active" ? "badge badge-active" : "badge badge-inactive";
  return <span className={className}>{status}</span>;
}
export default StatusBadge;
