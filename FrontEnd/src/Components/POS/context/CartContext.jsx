import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const CartContext = createContext();


export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("posCart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("posCart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, quantity) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i._id === item._id);

            if (existingItem) {
                // Update quantity if item already in cart
                return prevCart.map((i) =>
                    i._id === item._id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                // Add new item to cart
                return [...prevCart, { ...item, quantity }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    };

    const notify = (type, message) => {
            if (type === "success") {
                toast.success(message);
            } else if (type === "error") {
                toast.error(message);
            }
        }

    const updateQuantity = (itemId, newQuantity,item) => {
        console.log(newQuantity);
        console.log(item);
        
        
        if(newQuantity > item.availableQty){
            // alert(`exceed limit`);
            notify("error", "Exxceed the Limit");
            return;
        }
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("posCart");
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
