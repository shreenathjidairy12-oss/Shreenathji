// Customer.jsx
import React, { useEffect, useState } from "react";
import { getCustomerMonthlySummary } from "./api/customerApi";
import Calendar from "./Calendar/Calendar";
import { monthKey } from "./utils/dateUtils";
import Logout from "../Common/Logout";
import "./Customer.css";


function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    console.log("JWT PAYLOAD:", json); // DEBUG: shows actual fields
    return json;
  } catch {
    return {};
  }
}



const Customer = () => {
  const token = localStorage.getItem("token");
  const payload = token ? decodeJwt(token) : {};
  //   const customerId = payload.id || payload._id || payload.sub;
  const customerId = payload.id || payload._id || payload.sub || null;

  // const customerName = payload.name || payload.username || "Customer";
  const customerName =
    payload.name ||
    payload.fullName ||
    payload.username ||
    payload.customerName ||
    "Customer";

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // cache: { 'YYYY-MM': summaryObject }
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = monthKey(year, month);
  const summary = cache[key] || null;

  useEffect(() => {
    if (!customerId) return; // wait for login
    // on mount ensure we have current month
    if (!cache[key]) fetchAndCache(year, month);
    // eslint-disable-next-line
  }, [customerId]);

  async function fetchAndCache(y, m) {
    setError(null);
    setLoading(true);
    try {
      const res = await getCustomerMonthlySummary(customerId, y, m);
      // res.data expected
      const data = res.data;
      setCache((p) => ({ ...p, [monthKey(y, m)]: data }));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  function goPrev() {
    let y = year,
      m = month - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    const k = monthKey(y, m);
    if (!cache[k]) fetchAndCache(y, m);
    setYear(y);
    setMonth(m);
  }

  function goNext() {
    let y = year,
      m = month + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    const k = monthKey(y, m);
    if (!cache[k]) fetchAndCache(y, m);
    setYear(y);
    setMonth(m);
  }

const handleGenerateBill = async () => {
  if (!customerId) return alert("Customer ID missing");

  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/pdf/customers/${customerId}/generate-bill?month=${month}&year=${year}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      return alert("Failed to generate PDF");
    }

    const blob = await response.blob();
    const pdfURL = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = pdfURL;
    a.download = `MilkBill_${year}-${month}.pdf`;
    a.click();

    window.URL.revokeObjectURL(pdfURL);
  } catch (err) {
    console.error(err);
    alert("Error generating bill");
  }
};


  return (
    <div className="cd-root">
      <div className="cd-logout-wrapper">
        <Logout />
      </div>

      <div className="cd-header">
        <div className="cd-title">
          <button className="cd-nav" onClick={goPrev} aria-label="prev">‹</button>
          <div className="cd-month">{new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}</div>
          <button className="cd-nav" onClick={goNext} aria-label="next">›</button>
        </div>
        <div className="cd-summary">
          <div className="cd-customer-name">
            Welcome, <strong>{customerName}</strong>
          </div>

          <div className="cd-summary-item">Total Litres: <strong>{summary ? summary.totalLitres : "—"}</strong></div>
          <div className="cd-summary-item">Total Amount: <strong>{summary ? `₹${summary.totalAmount}` : "—"}</strong></div>
          <button className="cd-bill-btn" onClick={handleGenerateBill}>
            Generate Bill (PDF)
          </button>

        </div>
      </div>

      {error && <div className="cd-error">{error}</div>}
      {loading && <div className="cd-loading">Loading...</div>}

      <Calendar year={year} month={month} dailyEntries={summary ? summary.daily : []} />

      <div className="cd-note">Hover a cell that has entries to see vendor name (shown on hover).</div>

      <details style={{ marginTop: 12 }}>
        <summary>Cached months (debug)</summary>
        <pre>{JSON.stringify(Object.keys(cache), null, 2)}</pre>
      </details>
    </div>
  );
};

export default Customer;
