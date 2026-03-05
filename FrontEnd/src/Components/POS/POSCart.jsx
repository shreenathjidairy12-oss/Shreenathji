import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import POSNavbar from "./POSNavbar";
import { useCart } from "./context/CartContext";
import { generateBill } from "./api/posApi";
import "./POSCart.css";

export default function POSCart() {
    const navigate = useNavigate();
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
    } = useCart();

    const [customerName, setCustomerName] = useState("");
    const [customerMobile, setCustomerMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateBill = async () => {
        if (!customerName.trim()) {
            setError("Please enter customer name");
            return;
        }

        if (customerMobile && !/^[6-9]\d{9}$/.test(customerMobile)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        if (cart.length === 0) {
            setError("Cart is empty");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const billData = {
                customerName: customerName.trim(),
                customerMobile: customerMobile.trim() || undefined,
                items: cart.map((item) => ({
                    itemId: item._id,
                    quantity: item.quantity,
                })),
            };

            const response = await generateBill(billData);

            // Clear cart and navigate to bill preview
            clearCart();
            navigate("/shopkeeper/pos/bills", {
                state: { generatedBill: response.bill }
            });
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to generate bill");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pos-cart-page">
            <POSNavbar cartItemCount={getCartItemCount()} />

            <div className="pos-cart-container">
                <h1 className="pos-cart-title"> Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <button
                            className="continue-shopping-btn"
                            onClick={() => navigate("/shopkeeper/pos/products")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            <h2 className="section-title">Cart Items</h2>

                            {cart.map((item) => (
                                
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-info">
                                        <h3 className="cart-item-name">{item.name}</h3>

                                        <h3 className="cart-item-name">{item.availableQty}</h3>
                                        <div className="cart-item-price">
                                            ₹{item.price} / {item.unitType}
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="cart-quantity-selector">
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1,item)}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item._id, parseInt(e.target.value) || 1,item)
                                                }
                                                className="cart-qty-input"
                                            />
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1, item)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="cart-item-total">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-section">
                            <h2 className="section-title">Checkout</h2>

                            <div className="checkout-card">
                                <div className="checkout-summary">
                                    <div className="summary-row">
                                        <span>Total Items:</span>
                                        <span>{getCartItemCount()}</span>
                                    </div>
                                    <div className="summary-row total-row">
                                        <span>Total Amount:</span>
                                        <span>₹{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="customer-form">
                                    <div className="form-group">
                                        <label>Customer Name *</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Enter customer name"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile Number (Optional)</label>
                                        <input
                                            type="tel"
                                            value={customerMobile}
                                            onChange={(e) => setCustomerMobile(e.target.value)}
                                            placeholder="Enter 10-digit mobile"
                                            maxLength="10"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <button
                                    className="generate-bill-btn"
                                    onClick={handleGenerateBill}
                                    disabled={loading}
                                >
                                    {loading ? "Generating..." : "Generate Bill"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
