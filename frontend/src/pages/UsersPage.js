import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { getUsers, createUser, updateUser, deactivateUser } from "../api/usersApi";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import StatusBadge from "../components/StatusBadge";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "Staff",
  });
  const [editingId, setEditingId] = useState(null);
  async function loadUsers() {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.fullName || !form.username) {
      setError("Full name and username are required.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      if (editingId) {
        await updateUser(editingId, form);
        setSuccess("User updated successfully.");
        setEditingId(null);
      } else {
        await createUser(form);
        setSuccess("User created successfully.");
      }
      
      setForm({ fullName: "", username: "", password: "", role: "Staff" });
      await loadUsers();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to save user.");
    } finally {
      setLoading(false);
    }
  }
  function handleEdit(user) {
    setEditingId(user._id);
    setForm({
      fullName: user.fullName,
      username: user.username,
      password: "",
      role: user.role,
    });
  }
  async function handleDeactivate(id) {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await deactivateUser(id);
      setSuccess("User deactivated.");
      await loadUsers();
    } catch (err) {
      setError(err.friendlyMessage || "Unable to deactivate user.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Administrator screen for managing Staff accounts"
      />
      {loading && <LoadingMessage message="Loading users..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
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
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td><StatusBadge status={user.status} /></td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                  {user.status === "Active" && (
                    <button className="btn-danger" onClick={() => handleDeactivate(user._id)}>Deactivate</button>
                  )}
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
