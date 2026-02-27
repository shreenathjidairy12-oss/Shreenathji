import { NavLink, useNavigate } from "react-router-dom";
import Logout from "../../Common/Logout";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">
      <div className="nav-title" onClick={() => navigate("/shopkeeper")}>
        🥛 Milk Business Dashboard
      </div>

      <div className="nav-links">
        <NavLink to="/shopkeeper/milk/daily-summary" className="nav-item">
          Daily Summary
        </NavLink>

        <NavLink to="/shopkeeper/milk/add-customer" className="nav-item">Add Customer</NavLink>
        <NavLink to="/shopkeeper/milk/add-area" className="nav-item">Add Area</NavLink>
        <NavLink to="/shopkeeper/milk/set-milk-price" className="nav-item">
          Set Milk Price
        </NavLink>

        <NavLink to="/shopkeeper/milk/billing" className="nav-item">
          Billing
        </NavLink>
      </div>

      <div className="nav-logout">
        <button
          className="back-to-landing-btn"
          onClick={() => navigate("/shopkeeper")}
        >
          ← Back
        </button>
        <Logout />
      </div>
    </nav>
  );
}
