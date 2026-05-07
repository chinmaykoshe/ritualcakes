import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

const ADMIN_EMAIL = 'ritualcake2019@gmail.com';

function PrivateRoute({ element }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const apiUrl = 'https://ritualcakes-stg-92alpha.vercel.app/api/user'; // note singular /user for current user
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;
        const userRole = user?.role?.toLowerCase();
        const userEmail = user?.email?.toLowerCase();

        if (userRole === 'admin' || userEmail === ADMIN_EMAIL) {
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
