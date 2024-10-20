import React, { useEffect, useState } from 'react';
import Loader from './Loader';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // Redirect to login if no token
          window.location.href = '/login';
          return;
        }
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/api/profile/`, { headers });
        if (!response.ok) {
          const errorData = await response.json();
          setError({ message: `Error fetching profile: ${errorData.detail || 'Unknown error'}`, status: response.status });
        } else {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        setError({ message: 'Error fetching profile', status: 500, error });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      <div className="space-y-2">
        <p><span className="font-bold">Username:</span> {profile.username}</p>
        <p><span className="font-bold">Role:</span> {profile.role}</p>
        <p><span className="font-bold">First Name:</span> {profile.first_name}</p>
        <p><span className="font-bold">Last Name:</span> {profile.last_name}</p>
        <p><span className="font-bold">Email:</span> {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;
