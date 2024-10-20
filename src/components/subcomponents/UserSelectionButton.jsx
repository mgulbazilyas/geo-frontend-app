import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../myaxios.js';
import { FaPencilAlt } from 'react-icons/fa';
import { ROLES, RESIDENT,
  BUILDING_OWNER,
  ADMIN } from '../../constants';
// import Modal from './Modal';
const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-7xl">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-4 right-4 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export const UserSelectionButton = ({ label, onSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({ username: '', first_name: '', last_name: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetchUsers();
    }
  }, [showModal]);

  const handleSaveUser = async () => {
    try {
      const isEditing = false;
      const accessToken = localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.PUBLIC_API_BASE_URL}/api/users/${search.id}/`
        : `${import.meta.env.PUBLIC_API_BASE_URL}/api/users/`;
        const response = await axios({
          method,
          url,
          headers,
          data: search,
        });
        if (response.status === 200) {
          const new_user = response.data;
          setUsers((users) => ([...users, new_user]));
          setShowModal(false);
          onSelect(new_user);
  
          // fetchUsers();
          setSearch({ username: '', first_name: '', last_name: '', email: '', role: '' }  );
        } else {
          alert(`Error saving user: ${response.data.detail || 'Unknown error'}`);
        }
    } catch (error) {
      console.log(error);
      alert('Error saving user');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/users/`, {
        params: {
          format: 'json',
          search: `${search.username} ${search.first_name} ${search.last_name} ${search.email} ${search.role}`,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    // setFormUser({ ...formUser, role: selectedRole });
    setSearch({ ...search, role: selectedRole }); // Update search input to reflect selected role
  };
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({ ...prevSearch, [name]: value }));
  };

  const handleAddUser = () => {
    handleSaveUser();
  };

  return (
    <div>
      <button
        type='button'
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between min-w-[100px]  space-x-2 bg-gray-100 p-2 rounded-lg border border-gray-300 hover:bg-gray-200"
      >
        <span bg-white>{label ?? 'NA'}</span>
        <FaPencilAlt className="text-gray-500" />
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Customer Selection</h2>
            <div className="mb-4 grid grid-cols-4 gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username..."
                value={search.username}
                onChange={handleSearchChange}
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name..."
                value={search.first_name}
                onChange={handleSearchChange}
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name..."
                value={search.last_name}
                onChange={handleSearchChange}
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="email"
                placeholder="Email..."
                value={search.email}
                onChange={handleSearchChange}
                className="p-2 border rounded-lg"
              />
               <select
        value={search.role}
        onChange={handleRoleChange}
        className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Role</option>
        <option value={RESIDENT}>Resident</option>
        <option value={BUILDING_OWNER}>Building Owner</option>
        <option value={ADMIN}>Admin</option>
      </select>
              
              <button
                onClick={fetchUsers}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg col-span-1"
              >
                Search
              </button>
              <button
                onClick={handleAddUser}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg col-span-1"
              >
                Add User
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">S/N</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">First Name</th>
                    <th className="border p-2">Last Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.first_name}</td>
                        <td className="border p-2">{user.last_name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{ROLES[user.role]}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => {
                              if (onSelect) {
                                onSelect(user);
                              }
                              setShowModal(false);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border p-2 text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserSelectionButton;
