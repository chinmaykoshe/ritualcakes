import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile: '',
    dob: '',
    address: '',
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
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setSignUpData((prevData) => ({ ...prevData, password: value }));
    if (!validatePassword(value)) {
    }
    setErrorMessages(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState); 
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    if (!validatePassword(signUpData.password)) {
      setErrorMessages("Password must contain at least one letter, one number, and be at least 8 characters long. Special characters are optional.");
      setLoading(false); 
      return;
    }

    try {
      const url = "https://ritualcakes-stg-92alpha.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });
      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || result.message || 'An error occurred during sign-up.';
        setErrorMessages(errorMessage);
        return;
      }

      setTimeout(async () => {
        setSucessMessages("Signup Sucess !!!");
        await navigate('/login');
      }, 2000);

    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred during sign-up.';
      setErrorMessages(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSignUpData({
      name: '',
      surname: '',
      email: '',
      mobile: '',
      dob: '',
      address: '',
      password: ''
    });
    setErrorMessages(null);
  };

  return (
    <div className="min-h-screen bg-bakery-cream px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-2xl bg-white p-6 shadow-premium md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-bakery-rose">
            Join Ritual Cakes
          </p>
          <h2 className="text-3xl font-bold text-bakery-chocolate md:text-4xl">Create Account</h2>
          <p className="mt-3 text-sm text-customGray">
            Save your details for smoother celebration orders.
          </p>
        </div>
        <form onSubmit={handleSignUpSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6">
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={signUpData.name}
                onChange={handleChange}
                className="input-premium"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="surname" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={signUpData.surname}
                onChange={handleChange}
                className="input-premium"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signUpData.email}
              onChange={handleChange}
              className="input-premium"
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
              className="input-premium"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="dob" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={signUpData.dob}
              onChange={handleChange}
              className="input-premium"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="address" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={signUpData.address}
              onChange={handleChange}
              className="input-premium"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-bakery-chocolate">Create Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{8,}$"
              title="Password must contain at least one letter, one number, and be at least 8 characters long. Special characters are optional."
              value={signUpData.password}
              onChange={handlePasswordChange}
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

          {errorMessages && (
            <p className="mb-4 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{errorMessages}</p> 
          )}

          {sucessMessages && (
            <p className="mb-4 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">{sucessMessages}</p> 
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="submit"
              className="btn-premium w-full"
              disabled={loading} 
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="btn-outline w-full"
              disabled={loading}
            >
              Reset
            </button>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-customGray">
            Already a customer?{' '}
            <a href="/login" className="text-bakery-rose hover:text-bakery-chocolate">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
