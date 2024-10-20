import React, { useState, useEffect } from 'react';
import axios from '../myaxios.js';
import Loader from './Loader';
import UserSelectionButton from './subcomponents/UserSelectionButton.jsx';

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ajaxLoading, setAjaxLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHouses = async () => {
      setAjaxLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(
          `${import.meta.env.PUBLIC_API_BASE_URL}/api/houses/`,
          {
            headers,
            params: {
              search: searchTerm,
              page: page,
            },
          }
        );
        if (response.status === 200) {
          setHouses(response.data.results);
          setTotalPages(Math.ceil(response.data.count / 10));
        } else {
          setError({ message: 'Error fetching houses', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching houses', status: error.response?.status || 500, error });
      } finally {
        setAjaxLoading(false);
        setLoading(false);
      }
    };

    fetchHouses();
  }, [searchTerm, page]);

  const handleUpdateHouse = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.put(
        `${import.meta.env.PUBLIC_API_BASE_URL}/api/houses/${selectedHouse.id}/`,
        selectedHouse,
        { headers }
      );
      if (response.status === 200) {
        const updatedHouses = houses.map((house) =>
          house.id === selectedHouse.id ? selectedHouse : house
        );
        setHouses(updatedHouses);
        setSelectedHouse(null);
      } else {
        setError({ message: 'Error updating house', status: response.status });
      }
    } catch (error) {
      setError({
        message: 'Error updating house',
        status: error.response?.status || 500,
        error,
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when search term changes
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageInputChange = (e) => {
    const newPage = parseInt(e.target.value, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
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
        <h1 className="text-2xl font-bold mb-4">Houses</h1>
        <p className="text-red-500 text-center">Error fetching houses: {error?.message} ({error?.status})</p>
        {error?.error && <pre>{JSON.stringify(error?.error, null, 2)}</pre>}
      </div>
    );
  }

  if (houses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Houses</h1>
        <p className="text-gray-500 text-center">No houses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Houses</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search houses..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      />
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">House Number</th>
            <th className="py-2 px-4 text-left">Resident</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{house.number}</td>
              <td className="py-2 px-4">
                {house.residentName}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => setSelectedHouse(house)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <input
          type="number"
          value={page}
          onChange={handlePageInputChange}
          min="1"
          max={totalPages}
          className="w-16 text-center border border-gray-300 rounded-lg"
        />
        <span>of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedHouse && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">House Details</h2>
          <form className="space-y-4">
            {/* ... other form fields */}
            <div>
              <label className="block font-semibold">Resident</label>
              <UserSelectionButton
                label={selectedHouse.residentName}
                onSelect={(user) => {
                  selectedHouse.resident = user.id;
                  setSelectedHouse((previous_val) => ({
                    ...previous_val,
                    resident: user.id,
                    residentName: user.first_name + ' ' + user.last_name,
                  }));
                }}
              />
            </div>
          </form>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleUpdateHouse}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedHouse(null)}
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

export default Houses;
