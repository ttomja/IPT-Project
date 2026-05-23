import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { getCategories, createCategory, updateCategory } from "../api/categoriesApi";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import EmptyState from "../components/EmptyState";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.categoryName) {
      setError("Category name is required.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateCategory(editingId, form);
        setSuccess("Category updated successfully.");
        setEditingId(null);
      } else {
        await createCategory(form);
        setSuccess("Category created successfully.");
      }
      
      setForm({ categoryName: "", description: "" });
      await loadCategories();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to save category.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category._id);
    setForm({
      categoryName: category.categoryName,
      description: category.description,
    });
  }
  return (
    <div>
      <PageHeader
        title="Category Management"
        subtitle="Create and update product categories"
      />
      {loading && <LoadingMessage message="Loading categories..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      <>
        {editingId && (
          <div className="message loading-message" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><strong>Editing Mode:</strong> {form.categoryName}</span>
            <button type="button" className="btn-edit" style={{ padding: '4px 10px' }} onClick={() => {
              setEditingId(null);
              setForm({ categoryName: "", description: "" });
              setError("");
              setSuccess("");
            }}>Cancel</button>
          </div>
        )}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group"><label>Category Name</label>
        <input name="categoryName" placeholder="e.g. Electronics" value={form.categoryName} onChange={handleChange} /></div>
        <div className="form-group"><label>Description</label>
        <input name="description" placeholder="Optional details" value={form.description} onChange={handleChange} /></div>
        <button type="submit" style={{ height: '38px' }}>
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>
      </>
      {categories.length === 0 ? (
        <EmptyState message="No categories found." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.categoryName}</td>
                <td>{category.description}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(category)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default CategoriesPage;
