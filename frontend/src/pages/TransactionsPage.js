import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import { getTransactions } from "../api/stockService";
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError("Unable to load transaction history.");
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);
  const filteredTransactions = transactions.filter((transaction) => {
    return filter === "All" || transaction.transactionType === filter;
  });
  return (
    <div>
      <PageHeader title="Transaction History" subtitle="View stock movement records" />
      <div className="filter-row">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="All">All Transactions</option>
          <option value="Stock In">Stock In</option>
          <option value="Stock Out">Stock Out</option>
        </select>
      </div>
      {loading && <LoadingMessage message="Loading transactions..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && filteredTransactions.length === 0 ? (
        <EmptyState message="No transactions found." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Previous</th>
              <th>New</th>
              <th>Processed By</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                <td>{transaction.productId?.productName || "-"}</td>
                <td>{transaction.transactionType}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.previousQuantity}</td>
                <td>{transaction.newQuantity}</td>
                <td>{transaction.processedBy?.fullName || "-"}</td>
                <td>{transaction.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default TransactionsPage;
