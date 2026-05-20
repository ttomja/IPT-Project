function StatusBadge({ status }) {
  let className = "badge";
  if (status === "Active") className += " badge-active";
  else if (status === "Inactive") className += " badge-inactive";
  else if (status === "Low Stock") className += " badge-warning";
  else className += " badge-inactive";
  return <span className={className}>{status}</span>;
}
export default StatusBadge;
