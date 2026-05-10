import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtpStage, setShowOtpStage] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessages, setSuccessMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigateToDashboard = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboards');
    } else {
      navigate('/');
    }
    window.location.reload();
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages(null);

    try {
      const url = "/auth/login"; // Use relative path for proxy
      const lowercasedSignInData = {
        ...signInData,
        email: signInData.email.toLowerCase(),
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lowercasedSignInData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Incorrect credentials!');
      }    

      const data = await response.json();
      
      // If backend requires OTP
      if (data.status === 'otp_sent') {
        setShowOtpStage(true);
        setSuccessMessages('OTP sent to your email/mobile. Please verify.');
      } else {
        // Direct login
        completeLogin(data);
      }
    } catch (error) {
      setErrorMessages(error.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages(null);

    try {
      const url = "/auth/verify-otp";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signInData.email.toLowerCase(),
          otp: otp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP');
      }

      const data = await response.json();
      completeLogin(data);
    } catch (error) {
      setErrorMessages(error.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (data) => {
    const { token, email, role, adminSecret } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', email.toLowerCase());
    localStorage.setItem('role', role);
    if (adminSecret) localStorage.setItem('key', adminSecret);
    
    setSuccessMessages('Sign in success! Redirecting...');
    setTimeout(() => {
      navigateToDashboard(role);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-md bg-white p-6 shadow-premium md:p-8">
        {!showOtpStage ? (
          <>
            <div className="mb-8 text-center">
              <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-pista-deep">
                Welcome back
              </p>
              <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Sign In</h2>
              <p className="mt-3 text-sm text-customGray">
                Access your orders, saved details, and admin tools.
              </p>
            </div>
            <form onSubmit={handleSignInSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signInData.email}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>
              <div className="mb-6 relative">
                <span className="flex justify-between items-center">
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Password</label>
                  <a href="/forgot-password" disabled={loading} className="text-sm font-semibold text-bakery-pista-deep hover:text-bakery-chocolate">Forgot password?</a>
                </span>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={signInData.password}
                  onChange={handleChange}
                  className="input-premium pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[2.55rem] text-bakery-chocolate/70 hover:text-bakery-chocolate"
                >
                  {passwordVisible ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
              {errorMessages && <p className="mb-4 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{errorMessages}</p>}
              {successMessages && <p className="mb-4 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">{successMessages}</p>}
              <p className="mb-6 text-center text-sm font-semibold text-customGray">
                New customer?{' '}
                <a href="/signup" className="text-bakery-pista-deep hover:text-bakery-chocolate">Create an account</a>
              </p>
              <button
                type="submit"
                className="btn-premium w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-pista-deep">
                Security Check
              </p>
              <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Enter OTP</h2>
              <p className="mt-3 text-sm text-customGray">
                We've sent a 6-digit code to your registered contacts.
              </p>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6 text-center">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full text-center text-4xl tracking-[0.5em] font-black py-4 border-2 border-bakery-pista/30 rounded-2xl focus:border-bakery-pista-mid outline-none transition-all"
                  maxLength={6}
                  required
                />
              </div>
              {errorMessages && <p className="mb-4 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{errorMessages}</p>}
              {successMessages && <p className="mb-4 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">{successMessages}</p>}
              <button
                type="submit"
                className="btn-premium w-full py-5 text-lg"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                className="mt-4 w-full text-sm font-bold text-bakery-chocolate/40 hover:text-bakery-pista-deep"
                onClick={() => setShowOtpStage(false)}
              >
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
