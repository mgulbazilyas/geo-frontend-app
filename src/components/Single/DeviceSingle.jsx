import React, { useState, useEffect } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';

const DevicesSingle = ({ id, prefetchedDevice }) => {
  const [device, setDevice] = useState(prefetchedDevice);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/devices/${id}/`, {
          headers,
        });
        if (response.status === 200) {
          setDevice(response.data);
        } else {
          setError({ message: 'Error fetching device', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching device', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    if (!prefetchedDevice) {
      fetchDevice();
    } else {
      setLoading(false);
    }
  }, [id, prefetchedDevice]);

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
      <h1>Device Details</h1>
      <p>Device Number: {device.number}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default DevicesSingle;
