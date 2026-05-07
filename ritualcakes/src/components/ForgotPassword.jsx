import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const apiUrl = "https://ritualcakes-stg-92alpha.vercel.app/api";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await axios.post(`${apiUrl}/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-bakery-cream px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-md bg-white p-6 shadow-premium md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-rose">
            Account help
          </p>
          <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Forgot Password</h2>
          <p className="mt-3 text-sm text-customGray">
            Enter your email and we will send a reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-semibold text-bakery-chocolate">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-premium mb-5"
            required
          />
          <button
            type="submit"
            className="btn-premium w-full"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
        {error && <p className="mt-4 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
