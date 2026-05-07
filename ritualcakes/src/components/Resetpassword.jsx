import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };
  const apiUrl = "https://ritualcakes-stg-92alpha.vercel.app/api";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000); 
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mt-2 lg:mt-16">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={newPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {newPasswordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i>
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i>
              )}
            </button>
          </div>
          <label className="block mb-2 text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {confirmPasswordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i>
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-darkcustombg2 text-white py-2 rounded hover:bg-darkcustombg3"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;