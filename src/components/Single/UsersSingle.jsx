import React, { useState, useEffect } from 'react';
import axios from '../../myaxios.js';
import Loader from '../Loader.jsx';

const UsersSingle = ({ id, prefetchedUser }) => {
  const [user, setUser] = useState(prefetchedUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/users/${id}/`, {
          headers,
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError({ message: 'Error fetching user', status: response.status });
        }
      } catch (error) {
        setError({ message: 'Error fetching user', status: error.response?.status || 500, error });
      } finally {
        setLoading(false);
      }
    };

    if (!prefetchedUser) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [id, prefetchedUser]);

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
      <h1>User Details</h1>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      {/* Add more details as needed */}
      {/* Example: */}
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UsersSingle;
