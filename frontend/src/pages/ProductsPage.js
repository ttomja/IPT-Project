import { useMemo, useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { getProducts, createProduct, updateProduct, deactivateProduct } from "../api/productsApi";
import { getCategories } from "../api/categoriesApi";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import EmptyState from "../components/EmptyState";
import { getCurrentUser } from "../services/authService";

function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = getCurrentUser();
  const isAdmin = user?.role === "Administrator" || user?.role === "Admin";

  const [form, setForm] = useState({
    productCode: "",
    productName: "",
    categoryId: "",
    description: "",
    unitOfMeasure: "",
    quantityInStock: 0,
    reorderLevel: 0,
    price: 0,
  });

  async function loadData() {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.productCode || !form.productName || !form.categoryId) {
      setError("Product code, product name, and category are required.");
      return;
    }
    
    const cleanedForm = {
      ...form,
      quantityInStock: Number(form.quantityInStock),
      reorderLevel: Number(form.reorderLevel),
      price: Number(form.price),
    };

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateProduct(editingId, cleanedForm);
        setSuccess("Product updated successfully.");
        setEditingId(null);
      } else {
        await createProduct(cleanedForm);
        setSuccess("Product created successfully.");
      }

      setForm({
        productCode: "",
        productName: "",
        categoryId: "",
        description: "",
        unitOfMeasure: "",
        quantityInStock: 0,
        reorderLevel: 0,
        price: 0,
      });
      await loadData();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    // extract only needed form fields (handle category population issues)
    setForm({
      productCode: product.productCode,
      productName: product.productName,
      categoryId: product.categoryId?._id || product.categoryId,
      description: product.description || "",
      unitOfMeasure: product.unitOfMeasure || "",
      quantityInStock: product.quantityInStock,
      reorderLevel: product.reorderLevel,
      price: product.price,
    });
  }

  async function handleDeactivate(id) {
    if (!window.confirm("Are you sure you want to deactivate this product?")) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await deactivateProduct(id);
      setSuccess("Product deactivated.");
      await loadData();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to deactivate product.");
    } finally {
      setLoading(false);
    }
  }

  function getCategoryName(categoryObjOrId) {
    if (!categoryObjOrId) return "-";
    if (categoryObjOrId.categoryName) return categoryObjOrId.categoryName;
    return categories.find((c) => c._id === categoryObjOrId)?.categoryName || "-";
  }
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(search.toLowerCase()) ||
        product.productCode.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || 
        product.categoryId === categoryFilter ||
        product.categoryId?._id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);
  
  return (
    <div>
      <PageHeader
        title="Product Management"
        subtitle="Create, update, search, filter, and deactivate product records"
      />
      {loading && <LoadingMessage message="Loading data..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      {isAdmin && (
      <form className="form-card product-form" onSubmit={handleSubmit}>
        <input name="productCode" placeholder="Product Code"
          value={form.productCode} onChange={handleChange} />
        <input name="productName" placeholder="Product Name"
          value={form.productName} onChange={handleChange} />
        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id}
              value={category.id}>{category.categoryName}</option>
          ))}
        </select>
        <input name="description" placeholder="Description"
          value={form.description} onChange={handleChange} />
        <input name="unitOfMeasure" placeholder="Unit of Measure"
          value={form.unitOfMeasure} onChange={handleChange} />
        <input name="quantityInStock" type="number" placeholder="Quantity"
          value={form.quantityInStock} onChange={handleChange} />
        <input name="reorderLevel" type="number" placeholder="Reorder Level"
          value={form.reorderLevel} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>
      )}
      <div className="filter-row">
        <input placeholder="Search by product name or code" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={categoryFilter} onChange={(e) =>
          setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category._id}
              value={category._id}>{category.categoryName}</option>
          ))}
        </select>
      </div>
      {filteredProducts.length === 0 ? (
        <EmptyState message="No products found." />
      ) : (
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Reorder</th>
            <th>Status</th>
            <th>Stock Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            const isLowStock = Number(product.quantityInStock) <= Number(product.reorderLevel);
            return (
              <tr key={product._id}>
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{product.quantityInStock}</td>
                <td>{product.reorderLevel}</td>
                <td><StatusBadge status={product.status} /></td>
                <td>{isLowStock ? <StatusBadge status="Low Stock" /> : "Normal"}</td>
                <td>
                  {isAdmin && (
                    <>
                      <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                      {product.status === "Active" && (
                        <button className="btn-danger" onClick={() => handleDeactivate(product._id)}>Deactivate</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
    </div>
  );
}
export default ProductsPage;
