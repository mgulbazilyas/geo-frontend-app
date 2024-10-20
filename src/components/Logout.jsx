import React from 'react';

const Logout = () => {
  const handleLogout = async () => {
    try {
      // Retrieve the refresh token from local storage or state management
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/api/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        // Clear the tokens from local storage or state management
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Logout
      </button>
    </div>
  );
};

export default Logout;
