import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = `https://ritualcakes-stg-92alpha.vercel.app/api/cart`;

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart([]);
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cartItems || []);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching cart items:", error);
          console.log("Full Error Response:", error.response?.data || error.message);
        }
      }
    };
    fetchCart();
  }, []);

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

      const response = await axios.post(
        `${apiUrl}/add`,
        { products: [product] },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      setSuccessMessage("Failed to add product to cart");
      setTimeout(() => setSuccessMessage(""), 3000);
      return null;
    }
  };
  const updateQuantity = async (orderID, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/update`,
        { orderID, quantity },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setCart((prevCart) => prevCart.map(item => item.orderID === orderID ? { ...item, quantity } : item));
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (orderID) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/remove/${orderID}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCart((prevCart) => prevCart.filter(item => item.orderID !== orderID));
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      for (const item of cart) {
        const orderID = item.orderID;

        const response = await axios.delete(`${apiUrl}/remove/${orderID}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status !== 200) {
          console.error(`Failed to remove item with orderID: ${orderID}`);
          return;
        }
      }

      setCart([]);
      console.log("All cart items have been removed.");

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
