import React, { useState, useEffect, useRef } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';
import UserSelectionButton from '../subcomponents/UserSelectionButton.jsx';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const rowRefs = useRef([]);
  const selectedDeviceRef = useRef(null);

  useEffect(() => {
    fetchDevices();
  }, [page, searchQuery]);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/devices/`, {
        headers,
        params: { page, search: searchQuery },
      });
      if (response.status === 200) {
        setDevices(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 devices per page
      } else {
        setError({ message: 'Error fetching devices', status: response.status });
      }
    } catch (error) {
      setError({ message: 'Error fetching devices', status: error.response?.status || 500, error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      const index = devices.findIndex((device) => device.id === selectedDevice.id);
      if (index !== -1) {
        selectedDeviceRef.value?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedDevice, devices]);

  const handleUpdateDevice = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.put(
        `${import.meta.env.PUBLIC_API_BASE_URL}/api/devices/${selectedDevice.id}/`,
        selectedDevice,
        { headers }
      );
      if (response.status === 200) {
        const updatedDevices = devices.map((device) =>
          device.id === selectedDevice.id ? selectedDevice : device
        );
        setDevices(updatedDevices);
        setSelectedDevice(null);
      } else {
        setError({ message: 'Error updating device', status: response.status });
      }
    } catch (error) {
      setError({
        message: 'Error updating device',
        status: error.response?.status || 500,
        error,
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Devices</h1>
        <p className="text-red-500 text-center">Error fetching devices: {error?.message} ({error?.status})</p>
        {error?.error && <pre>{JSON.stringify(error?.error, null, 2)}</pre>}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Devices</h1>
        <p className="text-gray-500 text-center">No devices found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>
      <input
        type="text"
        placeholder="Search devices..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="block w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Device Number</th>
            <th className="py-2 px-4 text-left">Owner</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr
              key={device.id}
              ref={(el) => (rowRefs.current[index] = el)}
              className={`border-b hover:bg-gray-50 ${
                selectedDevice?.id === device.id ? 'bg-gray-200' : ''
              }`}
            >
              <td className="py-2 px-4">{device.number}</td>
              <td className="py-2 px-4">
                {device.ownerName}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => setSelectedDevice(device)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDevice && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md" ref={(el) => (selectedDeviceRef.value = el)}>
          <h2 className="text-xl font-bold mb-4">Device Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Owner</label>
              <UserSelectionButton label={selectedDevice.ownerName} onSelect={(user) => {
                selectedDevice.owner = user.id;
                setSelectedDevice((previous_val) => ({...previous_val, owner: user.id, ownerName: user.first_name + ' ' + user.last_name}));
              }} />
            </div>
          </form>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleUpdateDevice}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedDevice(null)}
              className="mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded-md">
          Previous
        </button>
        <input
          type="number"
          value={page}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          min="1"
          max={totalPages}
          className="w-16 p-2 text-center border border-gray-300 rounded-md"
        />
        <span>of {totalPages}</span>

        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded-md">
          Next
        </button>
      </div>
    </div>
  );
};

export default Devices;
