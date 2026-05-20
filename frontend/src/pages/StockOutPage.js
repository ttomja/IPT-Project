import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { getProducts } from "../api/productService";
import { recordStockOut } from "../api/stockService";
function StockOutPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", quantity: "", remarks: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
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
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to record stock-out transaction.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <PageHeader title="Stock-Out" subtitle="Record outgoing product quantity" />
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
