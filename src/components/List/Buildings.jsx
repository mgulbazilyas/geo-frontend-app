import React, { useState, useEffect, useRef } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';
import Modal from '../subcomponents/Modal.jsx'; // Assuming a Modal component is available
import UserSelectionButton from '../subcomponents/UserSelectionButton.jsx'; // New UserSelection component

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedRef = useRef();

  useEffect(() => {
    if (selectedBuilding) {
      selectedRef.value?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedBuilding]);

  useEffect(() => {
    fetchBuildings();
  }, [page, searchQuery]);

  const fetchBuildings = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/buildings/`, {
        headers,
        params: { page, search: searchQuery },
      });
      if (response.status === 200) {
        setBuildings(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 buildings per page
      } else {
        setError({ message: 'Error fetching buildings', status: response.status });
      }
    } catch (error) {
      setError({ message: 'Error fetching buildings', status: error.response?.status || 500, error });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBuilding = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.put(
        `${import.meta.env.PUBLIC_API_BASE_URL}/api/buildings/${selectedBuilding.id}/`,
        selectedBuilding,
        { headers }
      );
      if (response.status === 200) {
        const updatedBuildings = buildings.map((building) =>
          building.id === selectedBuilding.id ? selectedBuilding : building
        );
        setBuildings(updatedBuildings);
        setSelectedBuilding(null);
      } else {
        setError({ message: 'Error updating building', status: response.status });
      }
    } catch (error) {
      setError({
        message: 'Error updating building',
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
        <h1 className="text-2xl font-bold mb-4">Buildings</h1>
        <p className="text-red-500 text-center">Error fetching buildings: {error?.message} ({error?.status})</p>
        {error?.error && <pre>{JSON.stringify(error?.error, null, 2)}</pre>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Buildings</h1>
      <input
        type="text"
        placeholder="Search buildings..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="block w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Building Number</th>
            <th className="py-2 px-4 text-left">Owner</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buildings.map((building) => (
            <tr key={building.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{building.number}</td>
              <td className="py-2 px-4">
                {building.ownerName}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => setSelectedBuilding(building)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBuilding && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md" ref={(el) => (selectedRef.value = el)}>
          <h2 className="text-xl font-bold mb-4">Building Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Building Number</label>
              <input
                type="text"
                value={selectedBuilding.number}
                onChange={(e) => setSelectedBuilding({ ...selectedBuilding, number: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold">Owner</label>
              <UserSelectionButton label={selectedBuilding.ownerName} onSelect={(user) => {
                selectedBuilding.owner = user.id;
                setSelectedBuilding((previous_val) => ({...previous_val, owner: user.id, ownerName: user.first_name + ' ' + user.last_name}));
              }} />
            </div>
            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                value={selectedBuilding.address}
                onChange={(e) => setSelectedBuilding({ ...selectedBuilding, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold">Floors</label>
              <input
                type="number"
                value={selectedBuilding.floors}
                onChange={(e) => setSelectedBuilding({ ...selectedBuilding, floors: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </form>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleUpdateBuilding}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedBuilding(null)}
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

export default Buildings;
