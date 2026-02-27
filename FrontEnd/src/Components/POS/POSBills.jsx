import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import POSNavbar from "./POSNavbar";
import { useCart } from "./context/CartContext";
import "./POSBills.css";

export default function POSBills() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartItemCount } = useCart();

    const generatedBill = location.state?.generatedBill;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // Create a simple text representation for download
        // In production, you'd use a library like jsPDF
        const billText = `
SHRINATHJI DAIRY
================

Bill No: ${generatedBill.billNumber}
Date: ${new Date(generatedBill.createdAt).toLocaleString()}

Customer: ${generatedBill.customerName}
${generatedBill.customerMobile ? `Mobile: ${generatedBill.customerMobile}` : ''}

Items:
------
${generatedBill.items.map(item =>
            `${item.itemName} - ${item.quantity} ${item.unitType}(s) x ₹${item.price} = ₹${item.total}`
        ).join('\n')}

------
Subtotal: ₹${generatedBill.subTotal}

Thank you for your purchase!
    `;

        const blob = new Blob([billText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bill_${generatedBill.billNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!generatedBill) {
        return (
            <div className="pos-bills-page">
                <POSNavbar cartItemCount={getCartItemCount()} />
                <div className="pos-bills-container">
                    <div className="no-bill">
                        <p>No bill to display</p>
                        <button
                            className="back-to-products-btn"
                            onClick={() => navigate("/shopkeeper/pos/products")}
                        >
                            Go to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pos-bills-page">
            <POSNavbar cartItemCount={getCartItemCount()} />

            <div className="pos-bills-container">
                <h1 className="pos-bills-title">📄 Bill Generated Successfully!</h1>

                <div className="bill-actions no-print">
                    <button className="action-btn print-btn" onClick={handlePrint}>
                        🖨️ Print Bill
                    </button>
                    <button className="action-btn download-btn" onClick={handleDownloadPDF}>
                        📥 Download PDF
                    </button>
                    <button
                        className="action-btn back-btn"
                        onClick={() => navigate("/shopkeeper/pos/products")}
                    >
                        ← Back to Products
                    </button>
                </div>

                <div className="bill-preview">
                    <div className="bill-header">
                        <h2 className="dairy-name">🏪 SHRINATHJI DAIRY</h2>
                        <p className="dairy-subtitle">Dairy Products Bill</p>
                    </div>

                    <div className="bill-info">
                        <div className="bill-info-row">
                            <span className="label">Bill No:</span>
                            <span className="value">{generatedBill.billNumber}</span>
                        </div>
                        <div className="bill-info-row">
                            <span className="label">Date:</span>
                            <span className="value">
                                {new Date(generatedBill.createdAt).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    <div className="customer-info">
                        <div className="customer-info-row">
                            <span className="label">Customer:</span>
                            <span className="value">{generatedBill.customerName}</span>
                        </div>
                        {generatedBill.customerMobile && (
                            <div className="customer-info-row">
                                <span className="label">Mobile:</span>
                                <span className="value">{generatedBill.customerMobile}</span>
                            </div>
                        )}
                    </div>

                    <div className="bill-items">
                        <table className="bill-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedBill.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>
                                            {item.quantity} {item.unitType}
                                        </td>
                                        <td>₹{item.price}</td>
                                        <td>₹{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bill-total">
                        <div className="total-row">
                            <span className="total-label">Subtotal:</span>
                            <span className="total-value">₹{generatedBill.subTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bill-footer">
                        <p>Thank you for your purchase!</p>
                        <p className="footer-note">Please visit again</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
