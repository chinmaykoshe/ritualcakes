import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessages, setSuccessMessages] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMessages(null); 
  };

  const handleMobileChange = (e) => {
    const { value } = e.target;
    if (/^\d{0,10}$/.test(value)) {
      setSignUpData((prevData) => ({ ...prevData, mobile: value }));
      setErrorMessages(null);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{8,}$/;
    return regex.test(password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState); 
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prevState) => !prevState);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    if (!validatePassword(signUpData.password)) {
      setErrorMessages("Password must contain at least one letter, one number, and be at least 8 characters long.");
      setLoading(false); 
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessages("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const url = "/auth/signup"; // Relative path for proxy
      const { confirmPassword, ...submitData } = signUpData;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || result.message || 'An error occurred during sign-up.';
        setErrorMessages(errorMessage);
        return;
      }

      setSuccessMessages("Signup Success! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMessages(error.message || 'An unexpected error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSignUpData({
      name: '',
      email: '',
      mobile: '',
      dob: '',
      address: '',
      password: '',
      confirmPassword: ''
    });
    setErrorMessages(null);
  };

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-2xl bg-white p-6 shadow-premium md:p-8 border border-bakery-pista/20 rounded-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-pista-deep">
            Join Ritual Cakes
          </p>
          <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Create Account</h2>
          <p className="mt-3 text-sm text-customGray">
            Save your details for smoother celebration orders.
          </p>
        </div>
        <form onSubmit={handleSignUpSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={signUpData.name}
              onChange={handleChange}
              className="input-premium focus:border-bakery-pista"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={signUpData.email}
                onChange={handleChange}
                className="input-premium focus:border-bakery-pista"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="mobile" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                pattern="\d{10}"
                title="Mobile number must be exactly 10 digits long"
                value={signUpData.mobile}
                onChange={handleMobileChange}
                className="input-premium focus:border-bakery-pista"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6">
              <label htmlFor="dob" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Date of Birth (Optional)</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={signUpData.dob}
                onChange={handleChange}
                className="input-premium focus:border-bakery-pista"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="address" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Address (Optional)</label>
              <input
                type="text"
                id="address"
                name="address"
                value={signUpData.address}
                onChange={handleChange}
                className="input-premium focus:border-bakery-pista"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6 relative">
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Create Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={signUpData.password}
                onChange={handleChange}
                className="input-premium pr-12 focus:border-bakery-pista"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-[2.55rem] text-bakery-chocolate/70 hover:text-bakery-pista-deep"
              >
                {passwordVisible ? <i className="fa-regular fa-eye"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Confirm Password</label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={signUpData.confirmPassword}
                onChange={handleChange}
                className="input-premium pr-12 focus:border-bakery-pista"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-[2.55rem] text-bakery-chocolate/70 hover:text-bakery-pista-deep"
              >
                {confirmPasswordVisible ? <i className="fa-regular fa-eye"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>
          </div>

          {errorMessages && (
            <p className="mb-4 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{errorMessages}</p> 
          )}

          {successMessages && (
            <p className="mb-4 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">{successMessages}</p> 
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="submit"
              className="btn-premium w-full bg-bakery-pista hover:bg-bakery-pista-deep"
              disabled={loading} 
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="btn-outline w-full border-bakery-pista text-bakery-pista-deep hover:bg-bakery-pista/10"
              disabled={loading}
            >
              Reset
            </button>
          </div>

          <div className="text-center text-bakery-pista-deep/40 py-8 bg-bakery-pista-light/30 rounded-3xl mt-6">
            Already a customer?{' '}
            <a href="/login" className="text-bakery-pista hover:text-bakery-pista-deep underline">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
