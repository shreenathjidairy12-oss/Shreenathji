import { useNavigate } from "react-router-dom";
import "./AdminLanding.css";

export default function AdminLanding() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="landing-container">
                <h1 className="landing-title">🏪 Shrinathji Dairy</h1>
                <p className="landing-subtitle">Admin Portal - Select Business Type</p>

                <div className="business-cards">
                    <div
                        className="business-card milk-card"
                        onClick={() => navigate("/shopkeeper/milk/daily-summary")}
                    >
                        <div className="card-icon">🥛</div>
                        <h2 className="card-title">Milk Business</h2>
                        <p className="card-description">
                            Manage daily milk delivery, customers, vendors, and billing
                        </p>
                        <button className="card-button">Enter →</button>
                    </div>

                    <div
                        className="business-card pos-card"
                        onClick={() => navigate("/shopkeeper/pos/products")}
                    >
                        <div className="card-icon">🧈</div>
                        <h2 className="card-title">Dairy Products</h2>
                        <p className="card-description">
                            Point of Sale system for dairy products and inventory
                        </p>
                        <button className="card-button">Enter →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
