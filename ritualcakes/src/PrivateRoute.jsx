import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

function PrivateRoute({ element }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUrl = '/api/user'; // note singular /user for current user
        const response = await axios.get(apiUrl, {
          withCredentials: true, // include cookies if your auth uses them
        });

        const user = response.data.user;

        // Simple role-based check
        if (user && user.role === 'admin') {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // optional spinner
  }

  return authorized ? element : <Navigate to="/" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
