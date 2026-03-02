import React, { useState } from "react";
import { setMilkPrice } from "../api/adminApi";
import "./SetMilkPrice.css";

export default function SetMilkPrice() {
  const [type, setType] = useState("cow");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!price || price <= 0) {
      return setError("Enter a valid price");
    }

    try {
      setLoading(true);
      const res = await setMilkPrice({ type, price: Number(price) });
      setSuccess(res.data);
      setPrice("");
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <h2 className="page-title">🥛 Set Milk Price</h2>

      <div className="cardMilk">
        <form onSubmit={handleSubmit}>
          <label>Milk Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="cow">Cow</option>
            <option value="buffalo">Buffalo</option>
          </select>

          <label>Price (₹ per litre)</label>
          <input
            className="input"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <p className="info-text">
            ℹ️ New price will be applied from <b>next day</b>
          </p>

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Price"}
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="modal-backdrop" onClick={() => setSuccess(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Price Updated Successfully</h3>
            <p><b>Milk Type:</b> {type}</p>
            <p><b>New Price:</b> ₹{success.price}</p>
            <p>
              <b>Effective From:</b>{" "}
              {new Date(success.effectiveFrom).toDateString()}
            </p>

            <button className="btn" onClick={() => setSuccess(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
