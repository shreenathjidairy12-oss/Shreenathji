import React, { useState } from "react";
import { addArea } from "../api/adminApi";
import "./AddArea.css";

export default function AddArea() {
  const [name, setName] = useState("");
  const [subareas, setSubareas] = useState([""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateSubarea = (i, v) => {
    const copy = [...subareas];
    copy[i] = v;
    setSubareas(copy);
  };

  const addSubarea = () => setSubareas([...subareas, ""]);
  const removeSubarea = (i) => setSubareas(subareas.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setError("Area name is required");

    try {
      setLoading(true);
      const res = await addArea({ name, subareas: subareas.filter(Boolean) });
      setSuccess(res.data.area);
      setName("");
      setSubareas([""]);
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to create area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <h2 className="page-title">➕ Add Area</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Area Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />

          <label>Subareas</label>
          {subareas.map((s, i) => (
            <div className="subarea-row" key={i}>
              <input className="input" value={s} onChange={e => updateSubarea(i, e.target.value)} />
              {subareas.length > 1 && (
                <button type="button" onClick={() => removeSubarea(i)}>✕</button>
              )}
            </div>
          ))}

          <button type="button" className="link-btn" onClick={addSubarea}>+ Add Subarea</button>

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Area"}
          </button>
        </form>
      </div>

      {success && (
        <div className="modal-backdrop" onClick={() => setSuccess(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Area Created</h3>
            <pre>{JSON.stringify(success, null, 2)}</pre>
            <button className="btn" onClick={() => setSuccess(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
