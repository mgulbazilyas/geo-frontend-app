import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import UserSelectionButton from './subcomponents/UserSelectionButton.jsx';
import axios from 'axios';

const Readings = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);


  useEffect(() => {
    const fetchReadings = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          window.location.href = '/login';
          return;
        }
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/readings/`, { headers });
        if (response.status === 200) {
          setReadings(response.data.results);
        } else {
          setError({ message: 'Error fetching readings', status: response.status });
          }
      } catch (error) {
        setError({ message: 'Error fetching readings', status: error?.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const handleUpdateReading = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.put(
        `${import.meta.env.PUBLIC_API_BASE_URL}/api/readings/${selectedReading.id}/`,
        selectedReading,
        { headers }
      );
      if (response.status === 200) {
        const updatedReadings = readings.map((reading) =>
          reading.id === selectedReading.id ? selectedReading : reading
        );
        setReadings(updatedReadings);
        setSelectedReading(null);
      } else {
        setError({ message: 'Error updating reading', status: response.status });
      }
    } catch (error) {
      setError({
        message: 'Error updating reading',
        status: error?.response?.status || 500,
        error,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Readings</h1>
        <p className="text-red-500 text-center">Error: {error.message} ({error.status})</p>
        {error.error && <pre>{JSON.stringify(error.error, null, 2)}</pre>}
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Readings</h1>
        <p className="text-gray-500 text-center">No readings found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Readings</h1>
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Reading ID</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr key={reading.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{reading.id}</td>
              <td className="py-2 px-4">
                {reading.userName}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => setSelectedReading(reading)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReading && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Reading Details</h2>
          <form className="space-y-4">
            {/* ... other form fields */}
            <div>
              <label className="block font-semibold">User</label>
              <UserSelectionButton label={selectedReading.userName} onSelect={(user) => {
                selectedReading.user = user.id;
                setSelectedReading((previous_val) => ({...previous_val, user: user.id, userName: user.first_name + ' ' + user.last_name}));
              }}/>
            </div>
          </form>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleUpdateReading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedReading(null)}
              className="mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close Details
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Readings;
