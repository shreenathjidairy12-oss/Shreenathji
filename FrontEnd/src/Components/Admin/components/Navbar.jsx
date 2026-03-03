import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logout from "../../Common/Logout";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="admin-navbar">

      <div className="nav-left">
        <span>🥛</span>
        <div className="nav-title" onClick={() => navigate("/shopkeeper")}>
          Milk Business Dashboard
        </div>
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink onClick={() => setOpen(false)} to="/shopkeeper/milk/daily-summary" className="nav-item">
          Daily Summary
        </NavLink>

        <NavLink onClick={() => setOpen(false)} to="/shopkeeper/milk/add-customer" className="nav-item">
          Add Customer
        </NavLink>

        <NavLink onClick={() => setOpen(false)} to="/shopkeeper/milk/add-area" className="nav-item">
          Add Area
        </NavLink>

        <NavLink onClick={() => setOpen(false)} to="/shopkeeper/milk/set-milk-price" className="nav-item">
          Set Milk Price
        </NavLink>

        <NavLink onClick={() => setOpen(false)} to="/shopkeeper/milk/billing" className="nav-item">
          Billing
        </NavLink>
      </div>

      <div className="nav-logout">

        <button
          className="back-to-landing-btn"
          onClick={() => navigate("/shopkeeper")}
        >
          Back
        </button>

        <Logout />

        <button
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <span />
          <span />
          <span />
        </button>

      </div>

    </nav>
  );
}