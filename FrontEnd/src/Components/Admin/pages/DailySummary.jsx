import React, { useState } from "react";
import { getDailySummary } from "../api/adminApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DailySummary.css";

export default function DailySummary() {
  const [date, setDate] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!date) return alert("Please select a date!");

    const formattedDate = date.toISOString().split("T")[0];
    setLoading(true);

    try {
      const res = await getDailySummary(formattedDate);
      setSummary(res.data);
    } catch {
      alert("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="lux-header">
        <div className="lux-icon">📊</div>
        <div>
          <h2 className="page-title">Daily Business Summary</h2>
          <p className="lux-subtitle">
            Milk distribution & revenue intelligence
          </p>
        </div>
      </div>

      <div className="cardDailySummary lux-filter-card">
        <div className="lux-field">
          <label>Select date</label>

          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="lux-date-input"
            placeholderText="Choose business day"
            maxDate={new Date()}
            popperPlacement="bottom-start"
            popperClassName="lux-datepicker-popper"
            portalId="root"
          />
        </div>

        <div className="lux-field lux-btn-field">
          <button onClick={fetchSummary} className="btn-primary lux-generate">
            Generate Report
          </button>
        </div>
      </div>

      {loading && <p className="loading">Preparing luxury report…</p>}

      {summary && (
        <div className="summary-wrapper">
          <div className="cardDailySummary info-card lux-stat-card">
            <h3>{summary.date}</h3>
            <p>
              <strong>Total Milk Sold</strong>
              <span>{summary.totalLitres} L</span>
            </p>
            <p>
              <strong>Customers Served</strong>
              <span>{summary.totalCustomersServed}</span>
            </p>
          </div>

          <div className="cardDailySummary table-card">
            <h3>Customer Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Litres</th>
                </tr>
              </thead>
              <tbody>
                {summary.customers.map((c) => (
                  <tr key={c.customerId}>
                    <td>{c.customerName}</td>
                    <td>{c.litres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cardDailySummary table-card">
            <h3>Vendor Breakdown</h3>

            {summary.vendorBreakdown.length === 0 ? (
              <p>No vendor data for this date.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Litres</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.vendorBreakdown.map((v) => (
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
