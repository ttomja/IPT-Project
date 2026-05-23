import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { getProducts } from "../api/productsApi";
import { recordStockIn } from "../api/stockApi";
function StockInPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", quantity: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function loadProducts() {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load products for stock-in.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  function validateForm() {
    if (!form.productId) return "Please select a product.";
    if (!form.quantity || Number(form.quantity) <= 0) return "Quantity must be greater than 0.";
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
      await recordStockIn({
        productId: form.productId,
        quantity: Number(form.quantity),
        remarks: form.remarks,
      });
      setSuccess("Stock-in transaction recorded successfully.");
      setForm({ productId: "", quantity: "", remarks: "" });
      await loadProducts();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to record stock-in transaction.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <PageHeader title="Stock-In" subtitle="Record incoming product quantity" />
      {loading && <LoadingMessage message="Loading products..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group"><label>Product</label>
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productCode} - {product.productName}
            </option>
          ))}
        </select></div>
        <div className="form-group"><label>Quantity</label>
        <input name="quantity" type="number" min="1" placeholder="Quantity to add" value={form.quantity} onChange={handleChange} /></div>
        <div className="form-group"><label>Remarks</label>
        <input name="remarks" placeholder="Optional remarks" value={form.remarks} onChange={handleChange} /></div>
        <button type="submit" disabled={saving} style={{ height: '38px' }}>
          {saving ? "Saving..." : "Record Stock-In"}
        </button>
      </form>
    </div>
  );
}
export default StockInPage;
