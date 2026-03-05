import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import POSNavbar from "./POSNavbar";
import { useCart } from "./context/CartContext";
import { getItems, addItem, updateItemPrice, deleteItem } from "./api/posApi";
import { ToastContainer, toast } from "react-toastify";
import "./POSProducts.css";
import { set } from "mongoose";

export default function POSProducts() {
    const navigate = useNavigate();
    const { addToCart, getCartItemCount } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantities, setQuantities] = useState({});

    // Product management states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        unitType: "number",
        availableQty: "",
        image: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const notify = (type, message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        }
    }


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getItems();
            setProducts(data || []);


            // Initialize quantities
            const initialQuantities = {};
            (data || []).forEach((item) => {
                initialQuantities[item._id] = 1;
            });
            setQuantities(initialQuantities);
        } catch (err) {
            setError("Failed to load products");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (itemId, value, product) => {
        // const quantity = quantities[product._id] ;
        const qty = parseInt(value);
        // console.log(product);

        // const quantity = qty[product._id] || 1;
        if (qty > product.availableQty) {
        notify("error", `Only ${product.availableQty} ${product.unitType}(s) available`);

            return;
        }
        setQuantities((prev) => ({
            ...prev,
            [itemId]: Math.max(1, qty),
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product._id] || 1;

        if (quantity > product.availableQty) {
            notify("error", `Only ${product.availableQty} ${product.unitType}(s) available!`)
            return;
        }

        addToCart(product, quantity);
        notify("success",`Added ${quantity} ${product.unitType}(s) of ${product.name} to cart!` )

        // Reset quantity to 1
        setQuantities((prev) => ({
            ...prev,
            [product._id]: 1,
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            await addItem({
                name: formData.name,
                price: parseFloat(formData.price),
                unitType: formData.unitType,
                availableQty: parseFloat(formData.availableQty),
                image: formData.image || "",
            });

            notify("success", "Product added successfully!");

            setShowAddModal(false);
            setFormData({ name: "", price: "", unitType: "number", availableQty: "", image: "" });
            fetchProducts();
        } catch (err) {
            notify("err", "Failed to add product");

        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();

        try {
            await updateItemPrice(editingProduct._id, parseFloat(formData.price), parseFloat(formData.availableQty));

            notify("success", "Product price & Quantity updated successfully!");

            setShowEditModal(false);
            setEditingProduct(null);
            setFormData({ name: "", price: "", unitType: "number", availableQty: "", image: "" });
            fetchProducts();
        } catch (err) {
            notify("error",err.response?.data?.msg || "Failed to update product" )
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            unitType: product.unitType,
            availableQty: product.availableQty,
            image: product.image || "",
        });
        setShowEditModal(true);
    };

    const setShowdeleteModal = async (product) => {
        try {
            console.log(product._id);
            
            await deleteItem(product._id)
            notify("success", "Product deleted successfully!");
            fetchProducts();
                    setShowEditModal(false);

        } catch (error) {
            notify("err", "Item cant delete!");

        }
    }


    return (
        <div className="pos-products-page">
            <POSNavbar cartItemCount={getCartItemCount()} />

            <div className="pos-products-container">
                <div className="pos-products-header">
                    <h1 className="pos-products-title">📦 Dairy Products</h1>
                    <div className="header-actions">
                        <button
                            className="add-product-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            ➕ Add Product
                        </button>
                        <button
                            className="view-cart-btn"
                            onClick={() => navigate("/shopkeeper/pos/cart")}
                        >
                            🛒 View Cart ({getCartItemCount()})
                        </button>
                    </div>
                </div>

                {loading && <div className="loading">Loading products...</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && products.length === 0 && (
                    <div className="empty-state">
                        <p>No products available</p>
                        <p className="empty-subtitle">Click "Add Product" to get started</p>
                    </div>
                )}

                <div className="products-grid">
                    {products
                        .filter((p) => p.isActive)
                        .map((product) => (
                            <div key={product._id} className="product-card">
                                <button
                                    className="edit-product-btn"
                                    onClick={() => openEditModal(product)}
                                >
                                    ✏️ Edit
                                </button>

                                <div className="product-image">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} />
                                    ) : (
                                        <div className="product-placeholder">🧈</div>
                                    )}
                                </div>

                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-price">₹{product.price}</div>
                                    <div className="product-unit">per {product.unitType}</div>
                                    <div className="product-stock">
                                        Stock: {product.availableQty} {product.unitType}(s)
                                    </div>
                                </div>

                                <div className="product-actions">
                                    <div className="quantity-selector">
                                        <label>Quantity:</label>
                                        <div className="quantity-input-group">
                                            <button
                                                className="qty-btn"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        product._id,
                                                        quantities[product._id] - 1,
                                                        product
                                                    )
                                                }
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.availableQty}
                                                value={quantities[product._id] || 1}
                                                onChange={(e) =>
                                                    handleQuantityChange(product._id, e.target.value)
                                                }
                                                className="qty-input"
                                            />
                                            <button
                                                className="qty-btn"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        product._id,
                                                        quantities[product._id] + 1,
                                                        product
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.availableQty === 0}
                                    >
                                        {product.availableQty === 0 ? "Out of Stock" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">➕ Add New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Unit Type *</label>
                                <select
                                    value={formData.unitType}
                                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="number">number</option>
                                    <option value="liter">Liter</option>
                                    <option value="kg">Kg</option>

                                </select>
                            </div>

                            <div className="form-group">
                                <label>Available Quantity *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.availableQty}
                                    onChange={(e) => setFormData({ ...formData, availableQty: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="form-input"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                {/* <ToastContainer /> */}

                                <button type="submit" className="submit-btn" onClick={() => setShowAddModal(true)}>
                                    {/* <button type="button" className="cancel-btn" onClick={() => notify()}>
                                    Add Product
                                </button> */}

                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            {/* Edit Product Modal */}
            {
                showEditModal && editingProduct && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2 className="modal-title">✏️ Edit Product Price</h2>
                            <form onSubmit={handleEditProduct}>
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        disabled
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Price (₹) </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Unit Type</label>
                                    <input
                                        type="text"
                                        value={formData.unitType}
                                        disabled
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Stock</label>
                                    <input
                                        type="number"
                                        // value={formData.availableQty}
                                        // step="0.01"
                                        min="0"
                                        value={formData.availableQty}
                                        onChange={(e) => setFormData({ ...formData, availableQty: e.target.value })}
                                        required
                                        className="form-input" />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn" onClick={() => setShowEditModal(true)}>
                                        Update Price
                                    </button>
                                </div>
                            </form>
                                    <button type="delete" className="delete-btn" onClick={() => setShowdeleteModal(editingProduct)}>
                                        Delete Item
                                    </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
