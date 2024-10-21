import React, { useState, useEffect } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';

const ReadingsSingle = ({ id, prefetchedReading }) => {
  const [reading, setReading] = useState(prefetchedReading);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReading = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/readings/${id}/`, {
          headers,
        });
        if (response.status === 200) {
          setReading(response.data);
        } else {
          setError({ message: 'Error fetching reading', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching reading', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    if (!prefetchedReading) {
      fetchReading();
    } else {
      setLoading(false);
    }
  }, [id, prefetchedReading]);

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
      <h1>Reading Details</h1>
      <p>Reading ID: {reading.id}</p>
      {/* Add more details as needed */}
      {/* Example: */}
      <p>Value: {reading.value}</p>
      <p>Timestamp: {reading.timestamp}</p>
      {/* ... other relevant reading details */}
    </div>
  );
};

export default ReadingsSingle;
