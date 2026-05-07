import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = `/api/cart`;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCart();
  }, [token]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const existingItem = cart.find((item) => item.orderID === product.orderID);
      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.orderID === product.orderID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
      setCart(updatedCart);

      if (token) {
        const response = await axios.post(
          `${apiUrl}/add`,
          { products: [product] },
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        return response.data;
      }
    } catch (error) {
      setSuccessMessage("Failed to add product to cart");
      setTimeout(() => setSuccessMessage(""), 3000);
      return null;
    }
  };

  const updateQuantity = async (orderID, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${apiUrl}/update`,
          { orderID, quantity },
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
      }
      setCart((prevCart) => prevCart.map(item => item.orderID === orderID ? { ...item, quantity } : item));
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (orderID) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${apiUrl}/remove/${orderID}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
      setCart((prevCart) => prevCart.filter(item => item.orderID !== orderID));
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        for (const item of cart) {
          const orderID = item.orderID;
          await axios.delete(`${apiUrl}/remove/${orderID}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
        }
      }
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
