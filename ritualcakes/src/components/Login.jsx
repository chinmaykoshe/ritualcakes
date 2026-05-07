import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [errorMessages, setErrorMessages] = useState(null);
  const [sucessMessages, setSucessMessages] = useState(null);
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
      navigate('/home');
    }
    window.location.reload();
  };
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "https://ritualcakes-stg-92alpha.vercel.app/auth/login";
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
        if (response.status === 401) {
            throw new Error('Incorrect credentials!');
        } else {
            throw new Error('User not found!');
        }
    }    
      const { token, email, role, adminSecret } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('user', email.toLowerCase());
      localStorage.setItem('role', role);
      localStorage.setItem('key', adminSecret);
      navigateToDashboard(role);
      setTimeout(() => {
        setSucessMessages('Sign in sucess ! Redirecting...');
      }, 3000);
    } catch (error) {
      setErrorMessages(error.message || 'An error occurred during sign-in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const handleFocus = () => {
    setErrorMessages('');
  };
  
  return (
    <div className="min-h-screen bg-bakery-cream px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-md bg-white p-6 shadow-premium md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-rose">
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
              <a href="/forgot-password" className="text-sm font-semibold text-bakery-rose hover:text-bakery-chocolate">Forgot password?</a>
            </span>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              className="input-premium pr-12"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-[2.55rem] text-bakery-chocolate/70 hover:text-bakery-chocolate"
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i>
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i>
              )}
            </button>
          </div>
          {errorMessages && <p className="mb-4 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{errorMessages}</p>}
          {sucessMessages && <p className="mb-4 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">{sucessMessages}</p>}
          <p className="mb-6 text-center text-sm font-semibold text-customGray">
            New customer?{' '}
            <a href="/signup" className="text-bakery-rose hover:text-bakery-chocolate">Create an account</a>
          </p>
          <button
            type="submit"
            className="btn-premium w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <button
            type="button"
            className="mt-4 w-full py-3 text-sm font-semibold text-customGray hover:text-bakery-rose"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
