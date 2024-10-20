import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import axios from '../myaxios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formUser, setFormUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        window.location.href = '/login';
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/users/`, { headers });
      setUsers(response.data.results);
    } catch (error) {
      setError({ message: 'Error fetching users', status: error.response?.status || 500, error });
      console.error('Error fetching users:', error);

    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setFormUser(user);
    setIsEditing(true);
  };

  const handleCreateUser = () => {
    setFormUser({ username: '', role: '', first_name: '', last_name: '', email: '' });
    setIsEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
      const method = isEditing ? 'put' : 'post';
      const url = isEditing
        ? `${import.meta.env.PUBLIC_API_BASE_URL}/api/users/${formUser.id}/`
        : `${import.meta.env.PUBLIC_API_BASE_URL}/api/users/`;
      const response = await axios({
        method,
        url,
        headers,
        data: formUser,
      });
      if (response.status === 200 || response.status === 201) {
        fetchUsers();
        setFormUser(null);
      } else {
        alert(`Error saving user: ${response.data?.detail || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error saving user');
      console.error('Error saving user:', error);
    }
  };

  const handleBlockUnblockUser = async (user) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
      const response = await axios({
        method: 'patch',
        url: `${import.meta.env.PUBLIC_API_BASE_URL}/api/users/${user.id}/`,
        headers,
        data: { is_active: !user.is_active },
      });
      if (response.status === 200) {
        fetchUsers();
      } else {
        alert(`Error updating user: ${response.data?.detail || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p className="text-red-500 text-center">Error: {error.message} ({error.status})</p>
        {error.error && <pre>{JSON.stringify(error.error, null, 2)}</pre>}
      </div>
    );
  }
  const RESIDENT = '20';
const BUILDING_OWNER = '10';
const ADMIN = '0';

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <button onClick={handleCreateUser} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md">Create User</button>

      {formUser && (
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing ? 'Edit User' : 'Create User'}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              placeholder="Username"
              value={formUser.username}
              onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
              className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formUser.role}
              onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
              className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value={RESIDENT}>Resident</option>
              <option value={BUILDING_OWNER}>Building Owner</option>
              <option value={ADMIN}>Admin</option>
            </select>
            <input
              type="text"
              placeholder="First Name"
              value={formUser.first_name}
              onChange={(e) => setFormUser({ ...formUser, first_name: e.target.value })}
              className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formUser.last_name}
              onChange={(e) => setFormUser({ ...formUser, last_name: e.target.value })}
              className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formUser.email}
              onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
              className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <button onClick={handleSaveUser} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out">
              Save User
            </button>
            <button onClick={() => setFormUser(null)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out">
              Cancel
            </button>
          </div>
        </div>
      )}


      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Username</th>
            <th className="py-2">Role</th>
            <th className="py-2">First Name</th>
            <th className="py-2">Last Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="py-2">{user.username}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">{user.first_name}</td>
              <td className="py-2">{user.last_name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2">
                  Edit
                </button>
                <button onClick={() => handleBlockUnblockUser(user)} className={`px-2 py-1 rounded-md ${user.is_active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {user.is_active ? 'block' : 'UnBlock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
