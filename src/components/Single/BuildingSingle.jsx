import React, { useState, useEffect } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';

const BuildingsSingle = ({ id, prefetchedBuilding }) => {
  const [building, setBuilding] = useState(prefetchedBuilding);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/buildings/${id}/`, {
          headers,
        });
        if (response.status === 200) {
          setBuilding(response.data);
        } else {
          setError({ message: 'Error fetching building', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching building', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    if (!prefetchedBuilding) {
      fetchBuilding();
    } else {
      setLoading(false);
    }
  }, [id, prefetchedBuilding]);

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
      <h1>Building Details</h1>
      <p>Building Number: {building.number}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default BuildingsSingle;
