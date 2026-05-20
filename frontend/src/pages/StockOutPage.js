import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import LoadingMessage from "../components/LoadingMessage";
import { getProducts } from "../api/productsApi";
import { recordStockOut } from "../api/stockApi";

function StockOutPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", quantity: "", remarks: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);
  const selectedProduct = products.find((product) => product._id === form.productId);
  const availableQuantity = selectedProduct?.quantityInStock ?? 0;
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  function validateForm() {
    const requestedQuantity = Number(form.quantity);
    if (!form.productId) return "Please select a product.";
    if (!requestedQuantity || requestedQuantity <= 0) return "Quantity must be greater than 0.";
    if (requestedQuantity > availableQuantity) return "Stock-out quantity cannot exceed available stock.";
    return "";
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setSaving(true);
      await recordStockOut({
        productId: form.productId,
        quantity: Number(form.quantity),
        remarks: form.remarks,
      });
      setSuccess("Stock-out transaction recorded successfully.");
      setForm({ productId: "", quantity: "", remarks: "" });
      await loadProducts();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to record stock-out transaction.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <PageHeader title="Stock-Out" subtitle="Record outgoing product quantity" />
      {loading && <LoadingMessage message="Loading products..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productCode} - {product.productName}
            </option>
          ))}
        </select>
        <div className="stock-note">
          Available Stock: <strong>{availableQuantity}</strong>
        </div>
        <input
          name="quantity"
          type="number"
          min="1"
          placeholder="Quantity to remove"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Record Stock-Out"}
        </button>
      </form>
    </div>
  );
}
export default StockOutPage;
