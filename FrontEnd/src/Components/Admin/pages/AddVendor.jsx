import React, { useState } from "react";
import { addVendor } from "../api/adminApi";
import "./AddVendor.css";

export default function AddVendor() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (k, v) => {
    setForm({ ...form, [k]: v });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const res = await addVendor(form);
      setSuccess(res.data);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <h2 className="page-title">➕ Add Vendor</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input className="input" value={form.name} onChange={e => handleChange("name", e.target.value)} />

          <label>Email</label>
          <input className="input" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} />

          <label>Password</label>
          <input className="input" type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} />

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Vendor"}
          </button>
        </form>
      </div>

      {success && (
        <div className="modal-backdrop" onClick={() => setSuccess(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Vendor Created</h3>
            <pre>{JSON.stringify(success, null, 2)}</pre>
            <button className="btn" onClick={() => setSuccess(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
