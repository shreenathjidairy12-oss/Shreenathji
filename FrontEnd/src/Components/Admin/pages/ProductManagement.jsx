import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductManagement.css";

const API = "http://localhost:5001/api";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        unitType: "number",
        price: "",
        availableQty: "",
        image: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/pos/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            showMessage("Failed to fetch products", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                availableQty: parseFloat(formData.availableQty),
            };

            if (editingId) {
                // Update existing product (only price can be updated via PATCH)
                await axios.patch(
                    `${API}/pos/items/${editingId}/price`,
                    { price: payload.price },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                showMessage("Product updated successfully!", "success");
            } else {
                // Add new product
                await axios.post(`${API}/pos/items`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showMessage("Product added successfully!", "success");
            }

            // Reset form and refresh list
            resetForm();
            fetchProducts();
        } catch (err) {
            showMessage(
                err.response?.data?.msg || "Operation failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            unitType: product.unitType,
            price: product.price.toString(),
            availableQty: product.availableQty.toString(),
            image: product.image || "",
        });
        setEditingId(product._id);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            unitType: "number",
            price: "",
            availableQty: "",
            image: "",
        });
        setEditingId(null);
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    return (
        <div className="product-management-page">
            <h1 className="page-title">Product Management</h1>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className="product-content">
                {/* Add/Edit Form */}
                <div className="product-form-card">
                    <h2>{editingId ? "Update Product" : "Add New Product"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={editingId !== null}
                                placeholder="e.g., Milk Packet, Bread"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit Type *</label>
                            <select
                                name="unitType"
                                value={formData.unitType}
                                onChange={handleInputChange}
                                required
                                disabled={editingId !== null}
                            >
                                <option value="number">Number (pieces)</option>
                                <option value="liter">Liter</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="e.g., 50.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Available Quantity *</label>
                            <input
                                type="number"
                                name="availableQty"
                                value={formData.availableQty}
                                onChange={handleInputChange}
                                required
                                min="0"
                                disabled={editingId !== null}
                                placeholder="e.g., 100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Image URL (optional)</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                disabled={editingId !== null}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading
                                    ? "Processing..."
                                    : editingId
                                        ? "Update Price"
                                        : "Add Product"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Product List */}
                <div className="product-list-card">
                    <h2>Product List ({products.length})</h2>
                    {products.length === 0 ? (
                        <p className="empty-text">No products found. Add your first product!</p>
                    ) : (
                        <div className="product-table-wrapper">
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Unit</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="product-name">{product.name}</td>
                                            <td>{product.unitType}</td>
                                            <td className="product-price">₹{product.price.toFixed(2)}</td>
                                            <td>{product.availableQty}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${product.isActive ? "active" : "inactive"
                                                        }`}
                                                >
                                                    {product.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Edit Price
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
