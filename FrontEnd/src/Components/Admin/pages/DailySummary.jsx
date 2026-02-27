import React, { useState } from "react";
import { getDailySummary } from "../api/adminApi";
import "./AdminPages.css";

export default function DailySummary() {
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!date) return alert("Please select a date!");
    setLoading(true);

    try {
      const res = await getDailySummary(date);
      setSummary(res.data);
    } catch {
      alert("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">📅 Daily Summary</h2>

      <div className="card input-card">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <button onClick={fetchSummary} className="btn-primary">
          Generate
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {summary && (
        <div className="summary-wrapper">
          <div className="card info-card">
            <h3>Date: {summary.date}</h3>
            <p><strong>Total Milk Sold:</strong> {summary.totalLitres} L</p>
            <p><strong>Total Customers:</strong> {summary.totalCustomersServed}</p>
          </div>

          <div className="card table-card">
            <h3>Customer Breakdown</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Litres</th></tr>
              </thead>
              <tbody>
                {summary.customers.map(c => (
                  <tr key={c.customerId}>
                    <td>{c.customerName}</td>
                    <td>{c.litres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card table-card">
            <h3>Vendor Breakdown</h3>
            {summary.vendorBreakdown.length === 0 ? (
              <p>No vendor data for this date.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Vendor</th><th>Litres</th></tr>
                </thead>
                <tbody>
                  {summary.vendorBreakdown.map(v => (
                    <tr key={v.vendor}>
                      <td>{v.vendor}</td>
                      <td>{v.litres}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
