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
      const url = "/auth/signup";
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mt-2 lg:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUpSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={signUpData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="surname" className="block text-gray-700 font-medium mb-2">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={signUpData.surname}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signUpData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              pattern="\d{10}"
              title="Mobile number must be exactly 10 digits long"
              value={signUpData.mobile}
              onChange={handleMobileChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={signUpData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={signUpData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Create Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{8,}$"
              title="Password must contain at least one letter, one number, and be at least 8 characters long. Special characters are optional."
              value={signUpData.password}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i> 
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i> 
              )}
            </button>
          </div>

          <hr className="my-6" />

          {errorMessages && (
            <p className="text-red-500 text-center mb-4">{errorMessages}</p> 
          )}

          {sucessMessages && (
            <p className="text-green-500 text-center mb-4">{sucessMessages}</p> 
          )}

          <div className="flex justify-between items-center mt-6 md:gap-6 gap-4">
            <button
              type="submit"
              className="w-full bg-orange-300 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-300"
              disabled={loading} 
            >
              Sign Up
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="w-full border border-orange-300 text-orange-300 text-xl font-bold py-3 rounded-lg hover:bg-orange-100"
              disabled={loading}
            >
              Reset
            </button>
          </div>

          <p className="mt-4 text-center text-m font-bold">
            Already a customer?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
