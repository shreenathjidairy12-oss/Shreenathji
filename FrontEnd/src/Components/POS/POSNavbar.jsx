import { NavLink, useNavigate } from "react-router-dom";
import Logout from "../Common/Logout";
import "./POSNavbar.css";

export default function POSNavbar({ cartItemCount = 0 }) {
    const navigate = useNavigate();

    return (
        <nav className="pos-navbar">
            <div className="pos-nav-left">
                <div className="pos-nav-title" onClick={() => navigate("/shopkeeper")}>
                    🧈 Dairy Products POS
                </div>
            </div>

            <div className="pos-nav-links">
                <NavLink
                    to="/shopkeeper/pos/products"
                    className={({ isActive }) => isActive ? "pos-nav-link active" : "pos-nav-link"}
                >
                    📦 Products
                </NavLink>

                <NavLink
                    to="/shopkeeper/pos/cart"
                    className={({ isActive }) => isActive ? "pos-nav-link active" : "pos-nav-link"}
                >
                    🛒 Cart
                    {cartItemCount > 0 && (
                        <span className="cart-badge">{cartItemCount}</span>
                    )}
                </NavLink>

                <NavLink
                    to="/shopkeeper/pos/bills"
                    className={({ isActive }) => isActive ? "pos-nav-link active" : "pos-nav-link"}
                >
                    📄 Bills
                </NavLink>
            </div>

            <div className="pos-nav-right">
                <button
                    className="back-to-landing-btn"
                    onClick={() => navigate("/shopkeeper")}
                >
                    ← Back to Dashboard
                </button>
                <Logout />
            </div>
        </nav>
    );
}
