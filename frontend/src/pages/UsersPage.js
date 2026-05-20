import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { getUsers } from "../api/userService";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "Staff",
  });
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (!form.fullName || !form.username) {
      alert("Full name and username are required.");
      return;
    }
    if (editingId) {
      setUsers(users.map((user) =>
        user.id === editingId ? { ...user, ...form } : user
      ));
      setEditingId(null);
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...form,
        status: "Active",
  };
      setUsers([...users, newUser]);
    }
    setForm({ fullName: "", username: "", password: "", role: "Staff" });
  }
  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName,
      username: user.username,
      password: "",
      role: user.role,
    });
  }
  function handleDeactivate(id) {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, status: "Inactive" } : user
    ));
  }
  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Administrator screen for managing Staff accounts"
      />
      {loading && <LoadingMessage message="Loading users..." />}
      {error && <ErrorMessage message={error} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Staff">Staff</option>
          <option value="Administrator">Administrator</option>
        </select>
        <button type="submit">{editingId ? "Update User" : "Add User"}</button>
      </form>
      {users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() =>
                    handleDeactivate(user.id)}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default UsersPage;
