import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Modal from './Modal'; // Assuming a Modal component is available
import UserSelectionButton from './subcomponents/UserSelectionButton.jsx'; // New UserSelection component

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/buildings/`, { headers });
        if (response.status === 200) {
          setBuildings(response.data.results);
        } else {
          setError({ message: 'Error fetching buildings', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching buildings', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

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
        // Update the building in the state or refetch the buildings
        const updatedBuildings = buildings.map((building) =>
          building.id === selectedBuilding.id ? selectedBuilding : building
        );
        setBuildings(updatedBuildings);
        setSelectedBuilding(null); // Close the details view
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
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
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
              }}/>

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
          <div className="mt-4 flex space-x-4"> {/* Added flex container */}
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

      {/* {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UserSelection
            onSelect={(owner) => {
              setSelectedBuilding({ ...selectedBuilding, owner: owner.name });
              setShowModal(false);
            }}
          />
        </Modal>
      )} */}
    </div>
  );
};

export default Buildings;

// UserSelection Component (in a separate file, e.g., UserSelection.js)
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
