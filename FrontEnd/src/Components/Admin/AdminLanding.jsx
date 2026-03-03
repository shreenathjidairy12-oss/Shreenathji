import { useNavigate } from "react-router-dom";
import "./AdminLanding.css";
import milkBussiness from "../../../public/Photos/MilkBussiness.jpg"
import DairyProduct from "../../../public/Photos/DairyProduct1.jpg"

export default function AdminLanding() {
  const navigate = useNavigate();

  return (
    <div className="admin-landing-root">
      <div className="admin-landing-wrapper">

        <h1 className="admin-landing-title">Shrinathji Dairy</h1>
        <p className="admin-landing-subtitle">
          Admin Control Center
        </p>

        <div className="admin-card-grid">

          {/* Milk business */}
          <div
            className="admin-premium-card card-animate-1"
            onClick={() => navigate("/shopkeeper/milk/daily-summary")}
          >
            <img
              className="admin-card-image"
              src={milkBussiness}
              alt="Milk business"
            />

            <div className="admin-card-overlay">
              <h2>Milk Business</h2>

              <p>
                Daily milk delivery, vendors, customers and billing system.
              </p>

              <div className="admin-card-tags">
                <span>🥛 Fresh Milk</span>
                <span>Daily Tracking</span>
              </div>

              <button className="admin-card-btn">
                Enter Dashboardd
              </button>
            </div>
          </div>


          {/* Dairy products */}
          <div
            className="admin-premium-card card-animate-2"
            onClick={() => navigate("/shopkeeper/pos/products")}
          >
            <img
              className="admin-card-image"
              src={DairyProduct}
              alt="Dairy products"
            />

            <div className="admin-card-overlay">
              <h2>Dairy Products</h2>

              <p>
                POS system, inventory and dairy product sales management.
              </p>

              <div className="admin-card-tags">
                <span>🧈 Products</span>
                <span>POS System</span>
              </div>

              <button className="admin-card-btn">
                Enter Dashboard
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}