import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const OrderContext = createContext();
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const isFetching = useRef(false); 
  const token = localStorage.getItem('token'); 
  useEffect(() => {
    const fetchOrders = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      setLoading(true);
      try {
        const userEmail = localStorage.getItem('user'); 
        if (!token || !userEmail) {
          throw new Error('Missing authentication details'); 
        }
        const response = await axios.get(`/api/orders/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data); 
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders'); 
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };
    fetchOrders(); 
  }, []); 
  const createOrder = async (orderData) => {
    setLoading(true); 
    try {
      if (!token) {
        setError('Token not found.'); 
        setLoading(false);
        return;
      }
      const response = await axios.post(`/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setOrders((prevOrders) => [...prevOrders, response.data.order]); 
    } catch (error) {
      setError(error.message || 'Failed to create order'); 
    } finally {
      setLoading(false); 
    }
  };
  const deleteOrder = async (orderID) => {
    setLoading(true); 
    try {
      await axios.delete(`/api/orders/${orderID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderID));
    } catch (error) {
      setError(error.message || 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        deleteOrder,
        error, 
        loading, 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
