import { useState } from "react";
import PageHeader from "../components/PageHeader";
function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "cat1", categoryName: "Office Supplies", description: "Office items" },
    { id: "cat2", categoryName: "Cleaning Supplies", description: "Cleaning items"
      },
  ]);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (!form.categoryName) {
      alert("Category name is required.");
      return;
    }
    if (editingId) {
      setCategories(categories.map((category) =>
        category.id === editingId ? { ...category, ...form } : category
      ));
      setEditingId(null);
    } else {
      setCategories([
        ...categories,
        { id: Date.now().toString(), ...form },
      ]);
    }
    setForm({ categoryName: "", description: "" });
  }
  function handleEdit(category) {
    setEditingId(category.id);
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
      <form className="form-card" onSubmit={handleSubmit}>
        <input
          name="categoryName"
          placeholder="Category Name"
          value={form.categoryName}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>
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
            <tr key={category.id}>
              <td>{category.categoryName}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CategoriesPage;
