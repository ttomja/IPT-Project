import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
function ProductsPage() {
  const categories = [
    { id: "cat1", categoryName: "Office Supplies" },
    { id: "cat2", categoryName: "Cleaning Supplies" },
  ];
  const [products, setProducts] = useState([
    {
      id: "p1",
      productCode: "P-001",
      productName: "Bond Paper",
      categoryId: "cat1",
      description: "A4 bond paper",
      unitOfMeasure: "Ream",
      quantityInStock: 10,
      reorderLevel: 5,
      price: 250,
      status: "Active",
    },
  ]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
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
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  function handleSubmit(event) {
    event.preventDefault();

 if (!form.productCode || !form.productName || !form.categoryId) {
      alert("Product code, product name, and category are required.");
      return;
    }
    const duplicateCode = products.some(
      (product) =>
        product.productCode === form.productCode && product.id !== editingId
    );
    if (duplicateCode) {
      alert("Product code already exists.");
      return;
    }
    const cleanedForm = {
      ...form,
      quantityInStock: Number(form.quantityInStock),
      reorderLevel: Number(form.reorderLevel),
      price: Number(form.price),
    };
    if (editingId) {
      setProducts(products.map((product) =>
        product.id === editingId ? { ...product, ...cleanedForm } : product
      ));
      setEditingId(null);
    } else {
      setProducts([
        ...products,
        { id: Date.now().toString(), ...cleanedForm, status: "Active" },
      ]);
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
  }
  function handleEdit(product) {
    setEditingId(product.id);
    setForm({ ...product });
  }
  function handleDeactivate(id) {
    setProducts(products.map((product) =>
      product.id === id ? { ...product, status: "Inactive" } : product
    ));
  }
  function getCategoryName(categoryId) {
    return categories.find((category) => category.id === categoryId)?.categoryName
      || "-";
  }
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(search.toLowerCase()) ||
        product.productCode.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);
  return (
    <div>
      <PageHeader
        title="Product Management"
        subtitle="Create, update, search, filter, and deactivate product records"
      />
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
      <div className="filter-row">
        <input placeholder="Search by product name or code" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={categoryFilter} onChange={(e) =>
          setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id}
              value={category.id}>{category.categoryName}</option>
          ))}
        </select>
      </div>
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
            const isLowStock = product.quantityInStock <= product.reorderLevel;
            return (
              <tr key={product.id}>
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>{product.quantityInStock}</td>
                <td>{product.reorderLevel}</td>
                <td><StatusBadge status={product.status} /></td>
                <td>{isLowStock ? "Low Stock" : "Normal"}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() =>
                    handleDeactivate(product.id)}>Deactivate</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default ProductsPage;
