// src/Components/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/config/api";
import "./Login.css";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("shopkeeper");
  const [form, setForm] = useState({ email: "", password: "", mobile: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- FIX AUTO SELECT (AUTOFILL) ---------------- */

  const fixAutoSelect = (e) => {
    const input = e.target;

    requestAnimationFrame(() => {
      if (
        input.selectionStart === 0 &&
        input.selectionEnd === input.value.length
      ) {
        input.setSelectionRange(
          input.value.length,
          input.value.length
        );
      }
    });
  };

  /* ------------------------------------------------------------ */

  const loginStaff = (payload) =>
    axios.post(`${API}/auth/staff/login`, payload);

  const loginCustomer = (payload) =>
    axios.post(`${API}/auth/customer/login`, payload);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const isStaff = role === "shopkeeper" || role === "vendor";

    if (isStaff && (!form.email.trim() || !form.password)) {
      setError("Enter email and password");
      setLoading(false);
      return;
    }

    if (!isStaff && !form.mobile.trim()) {
      setError("Enter mobile number");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (isStaff) {
        response = await loginStaff({
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        response = await loginCustomer({
          mobile: form.mobile.trim(),
        });
      }

      const data = response?.data;

      localStorage.setItem("token", data.token);

      if (data?.staff?.role === "shopkeeper") {
        localStorage.setItem("role", "shopkeeper");
        navigate("/shopkeeper", { replace: true });
      } else if (data?.staff?.role === "vendor") {
        localStorage.setItem("role", "vendor");
        navigate("/vendor", { replace: true });
      } else {
        localStorage.setItem("role", "customer");
        navigate("/customer", { replace: true });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Invalid Email Or Password!";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <div className="dairy-login-page">

      {/* animated background blobs */}
      <div className="dairy-login-bg">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <div className="dairy-login-wrapper">

        {/* LEFT BRAND PANEL */}
        <div className="dairy-login-brand">
          <img src={logo} className="dairy-login-logo" alt="logo" />

          <h1>Shreenathji Dairy</h1>
          <p>Farm & Milk Management Platform</p>

          <div className="dairy-login-badge">
            Fresh • Trusted • Daily
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="dairy-login-card">

          <div className="dairy-login-tabs">
            <div
              className="dairy-login-tab-indicator"
              style={{
                transform:
                  role === "shopkeeper"
                    ? "translateX(0%)"
                    : "translateX(100%)",
              }}
            />

            <button
              type="button"
              className={`dairy-login-tab ${
                role === "shopkeeper" ? "active" : ""
              }`}
              onClick={() => {
                setRole("shopkeeper");
                setError("");
              }}
            >
              Shop Login
            </button>

            <button
              type="button"
              className={`dairy-login-tab ${
                role === "customer" ? "active" : ""
              }`}
              onClick={() => {
                setRole("customer");
                setError("");
              }}
            >
              Customer Login
            </button>
          </div>

          <form className="dairy-login-form" onSubmit={handleSubmit}>

            <div key={role} className="dairy-login-fields animated">

              {role === "customer" ? (
                <>
                  <label className="dairy-login-label">Mobile number</label>

                  <div className="dairy-login-input">
                    <span className="dairy-login-icon">
                      <MobileIcon />
                    </span>

                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={form.mobile}
                      onChange={onChange}
                      onFocus={fixAutoSelect}
                      onMouseUp={fixAutoSelect}
                      autoComplete="tel"
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="dairy-login-label">Username</label>

                  <div className="dairy-login-input">
                    <span className="dairy-login-icon">
                      <UserIcon />
                    </span>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter username"
                      value={form.email}
                      onChange={onChange}
                      onFocus={fixAutoSelect}
                      onMouseUp={fixAutoSelect}
                      autoComplete="username"
                    />
                  </div>

                  <label className="dairy-login-label">Password</label>

                  <div className="dairy-login-input">
                    <span className="dairy-login-icon">
                      <LockIcon />
                    </span>

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={onChange}
                      onFocus={fixAutoSelect}
                      onMouseUp={fixAutoSelect}
                      autoComplete="current-password"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="dairy-login-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {error && (
              <div className="dairy-login-error">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  );
}