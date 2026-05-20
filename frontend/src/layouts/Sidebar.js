import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";
function Sidebar() {
  const user = getUser();
  const isAdmin = user?.role === "Administrator";
  return (
    <aside className="sidebar">
      <h2>IMS</h2>
      <p>{user?.fullName}</p>
      <p>{user?.role}</p>
      <Link to="/dashboard">Dashboard</Link>
      {isAdmin && <Link to="/users">Users</Link>}
      <Link to="/categories">Categories</Link>
      <Link to="/products">Products</Link>
      <Link to="/stock-in">Stock In</Link>
      <Link to="/stock-out">Stock Out</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/reports">Reports</Link>
    </aside>
  );
}
export default Sidebar;
