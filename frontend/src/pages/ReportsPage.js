import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ErrorMessage from "../components/ErrorMessage";
import { getCurrentInventoryReport, getLowStockReport, getStockInReport, getStockOutReport } from "../api/reportService";
function ReportsPage() {
  const [activeReport, setActiveReport] = useState("inventory");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadReport() {
      try {
        setError("");
        let data = [];
        if (activeReport === "inventory") data = await getCurrentInventoryReport();
        if (activeReport === "low-stock") data = await getLowStockReport();
        if (activeReport === "stock-in") data = await getStockInReport();
        if (activeReport === "stock-out") data = await getStockOutReport();
        setRows(data);
      } catch (err) {
        setError("Unable to load selected report.");
      }
    }
    loadReport();
  }, [activeReport]);
  function renderInventoryRows() {
    return rows.map((product) => (
      <tr key={product._id}>
        <td>{product.productCode}</td>
        <td>{product.productName}</td>
        <td>{product.categoryId?.categoryName || "-"}</td>
        <td>{product.quantityInStock}</td>
        <td>{product.reorderLevel}</td>
        <td>{product.quantityInStock <= product.reorderLevel ? "Low Stock" : "Normal"}</td>
      </tr>
    ));
  }
  function renderTransactionRows() {
    return rows.map((transaction) => (
      <tr key={transaction._id}>
        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
        <td>{transaction.productId?.productName || "-"}</td>
        <td>{transaction.transactionType}</td>
        <td>{transaction.quantity}</td>
        <td>{transaction.previousQuantity}</td>
        <td>{transaction.newQuantity}</td>
      </tr>
    ));
  }
  const isProductReport = activeReport === "inventory" || activeReport === "low-stock";
  return (
    <div>
      <PageHeader title="Reports" subtitle="Simple table-based inventory reports" />
      <div className="filter-row">
        <button onClick={() => setActiveReport("inventory")}>Current Inventory</button>
        <button onClick={() => setActiveReport("low-stock")}>Low Stock</button>
        <button onClick={() => setActiveReport("stock-in")}>Stock-In</button>
        <button onClick={() => setActiveReport("stock-out")}>Stock-Out</button>
      </div>
      {error && <ErrorMessage message={error} />}
      <table className="data-table">
        <thead>
          {isProductReport ? (
            <tr>
              <th>Code</th>
              <th>Product</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Status</th>
            </tr>
          ) : (
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Previous</th>
              <th>New</th>
            </tr>
          )}
        </thead>
        <tbody>{isProductReport ? renderInventoryRows() : renderTransactionRows()}</tbody>
      </table>
    </div>
  );
}
export default ReportsPage;
