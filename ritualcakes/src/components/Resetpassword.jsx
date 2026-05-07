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
    <div className="min-h-screen bg-bakery-cream px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-md bg-white p-6 shadow-premium md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-rose">
            Secure account
          </p>
          <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Reset Password</h2>
          <p className="mt-3 text-sm text-customGray">
            Choose a new password for your Ritual Cakes account.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-semibold text-bakery-chocolate">New Password</label>
          <div className="relative">
            <input
              type={newPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-premium mb-5 pr-12"
              required
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-4 top-[0.9rem] text-bakery-chocolate/70 hover:text-bakery-chocolate"
              aria-label="Toggle password visibility"
            >
              {newPasswordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i>
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i>
              )}
            </button>
          </div>
          <label className="mb-2 block text-sm font-semibold text-bakery-chocolate">Confirm Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input-premium mb-5 pr-12"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-4 top-[0.9rem] text-bakery-chocolate/70 hover:text-bakery-chocolate"
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
            className="btn-premium w-full"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
        {error && <p className="mt-4 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
