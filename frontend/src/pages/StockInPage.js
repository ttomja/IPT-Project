import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { getProducts } from "../api/productService";
import { recordStockIn } from "../api/stockService";
function StockInPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", quantity: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Unable to load products for stock-in.");
      } finally {
        setLoading(false);
      }
    }
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
    } catch (err) {
      setError(err.response?.data?.message || "Unable to record stock-in transaction.");
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
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productCode} - {product.productName}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          type="number"
          min="1"
          placeholder="Quantity to add"
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
          {saving ? "Saving..." : "Record Stock-In"}
        </button>
      </form>
    </div>
  );
}
export default StockInPage;
