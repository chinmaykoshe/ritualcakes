import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

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
        const apiUrl = 'https://ritualcakes-stg-92alpha.vercel.app/api/admin/authorize';
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthorized(response.data.authorized === true);
      } catch (error) {
        console.error('Error authorizing admin:', error);
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
