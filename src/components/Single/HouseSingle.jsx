import React, { useState, useEffect } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';

const HousesSingle = ({ id, prefetchedHouse }) => {
  const [house, setHouse] = useState(prefetchedHouse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/houses/${id}/`, {
          headers,
        });
        if (response.status === 200) {
          setHouse(response.data);
        } else {
          setError({ message: 'Error fetching house', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching house', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    if (!prefetchedHouse) {
      fetchHouse();
    } else {
      setLoading(false);
    }
  }, [id, prefetchedHouse]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error.message} ({error.status})</p>
        {error.error && <pre>{JSON.stringify(error.error, null, 2)}</pre>}
      </div>
    );
  }

  return (
    <div>
      <h1>House Details</h1>
      <p>House Number: {house.number}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default HousesSingle;
