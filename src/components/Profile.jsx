import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { ROLES } from '../constants';
import axios from '../myaxios.js';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.PUBLIC_API_BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(response.data);
    } catch (error) {
      setError({
        message: `Error fetching profile: ${error.response?.data?.detail || 'Unknown error'}`,
        status: error.response?.status,
      });
    }
      } catch (error) {
        setError({ message: 'Error fetching profile', status: 500, error });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        window.location.href = '/login';
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const body = JSON.stringify({
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        is_active: profile.is_active,
      });
      try {
        const response = await axios.put(`${import.meta.env.PUBLIC_API_BASE_URL}/api/users/me/`, body, {
          headers,
        });
        setProfile(response.data);
      } catch (error) {
        setError({ message: `Error updating profile: ${error.response?.data?.detail || 'Unknown error'}`, status: error.response?.status || 500 });
      }
    } catch (error) {
      setError({ message: 'Error updating profile', status: 500, error });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-red-500 text-center">Error: {error.message} ({error.status})</p>
        {error.error && <pre>{JSON.stringify(error.error, null, 2)}</pre>}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block font-bold mb-1" htmlFor="username">Username:</label>
          <input
            type="text"
            disabled
            id="username"
            name="username"
            value={profile.username}
            // onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1" htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1" htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={profile.last_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* <div>
          <label className="block font-bold mb-1" htmlFor="is_active">Active Status:</label>
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={profile.is_active}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span>{profile.is_active ? 'Active' : 'Inactive'}</span>
        </div> */}
        <div>
          <label className="block font-bold mb-1">Role:</label>
          <p>{ROLES[profile.role]}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
