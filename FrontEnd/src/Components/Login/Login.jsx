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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const loginStaff = async (payload) => {
    return await axios.post(`${API}/auth/staff/login`, payload);
  };

  const loginCustomer = async (payload) => {
    return await axios.post(`${API}/auth/customer/login`, payload);
  };

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
        response = await loginCustomer({ mobile: form.mobile.trim() });
      }
      const data = response?.data;

      // Store token
      localStorage.setItem("token", data.token);

      // Store role and navigate based on role
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
      const msg = err?.response?.data?.message || "Invalid Email Or Password!";
      setError(msg);
      console.error("Login error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="page-bg">
      <div className="card">
        <div className="card-top">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1 className="title">Shrinathji Dairy</h1>
          <div className="subtitle">FARM MANAGEMENT SYSTEM</div>
        </div>

        <div className="card-body">
          <div className="tabs">
            <button
              className={`tab ${role === "shopkeeper" ? "active" : ""}`}
              onClick={() => {
                setRole("shopkeeper");
                setError("");
              }}
              type="button"
            >
              Shop Login
            </button>

            <button
              className={`tab ${role === "customer" ? "active" : ""}`}
              onClick={() => {
                setRole("customer");
                setError("");
              }}
              type="button"
            >
              Customer Login
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            {role === "customer" ? (
              <>
                <label className="label">MOBILE NUMBER</label>
                <div className="input-row">
                  <span className="input-icon">📱</span>
                  <input
                    name="mobile"
                    className="input"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={onChange}
                  />
                </div>
              </>
            ) : (
              <>
                <label className="label">USERNAME</label>
                <div className="input-row">
                  <span className="input-icon">👤</span>
                  <input
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Enter username"
                    value={form.email}
                    onChange={onChange}
                  />
                </div>

                <label className="label">PASSWORD</label>
                <div className="input-row">
                  <span className="input-icon">🔒</span>
                  <input
                    name="password"
                    className="input"
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={onChange}
                  />
                </div>
              </>
            )}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login →"}
            </button>

            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
