import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
const ADMIN_EMAIL = "ritualcake2019@gmail.com";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store backend user directly
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // only for auth header

  // Fetch user from backend
  const fetchUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "https://ritualcakes-stg-92alpha.vercel.app/api/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user); // store backend user directly
      setLoading(false);
    } catch (err) {
      setError("Error fetching user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const updateUser = async (updatedData) => {
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        "https://ritualcakes-stg-92alpha.vercel.app/api/user",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      setError("Error updating user data");
      setLoading(false);
    }
  };

  // Helper to check if logged-in user is admin
  const isAdmin = () => {
    const userRole = user?.role?.toLowerCase();
    const storedRole = localStorage.getItem("role")?.toLowerCase();
    const userEmail = user?.email?.toLowerCase();
    const storedEmail = localStorage.getItem("user")?.toLowerCase();

    return (
      userRole === "admin" ||
      storedRole === "admin" ||
      userEmail === ADMIN_EMAIL ||
      storedEmail === ADMIN_EMAIL
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        error,
        updateUser,
        fetchUser,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
