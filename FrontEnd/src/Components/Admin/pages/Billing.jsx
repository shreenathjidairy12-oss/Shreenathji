import React, { useState } from "react";
import { getBilling } from "../api/adminApi";
import "./Billing.css";


const Billing = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2025");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBilling = async () => {
    if (!month || !year) return alert("Select both month & year!");
    setLoading(true);

    try {
      const res = await getBilling(month, year);
      setData(res.data);
    } catch (e) {
      alert("Failed to fetch billing");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="billing-page">

    <h2 className="page-title">💰 Monthly Billing</h2>

    <div className="billing-card">
      <div className="billing-filters">
        <select onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />

        <button className="btn-primary" onClick={fetchBilling}>Fetch</button>
      </div>

      {data.length > 0 && (
        <table className="billing-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total Liters</th>
              <th>Total Charge</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cust) => (
              <tr key={cust.customerId}>
                <td>{cust.name}</td>
                <td>{cust.totalLiters}</td>
                <td>₹{cust.totalCharge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  </div>
);

};

export default Billing;
