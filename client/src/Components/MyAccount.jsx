import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const MyAccount = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result.user);
          setPhone(result.user.phone || '');
          setAddress(result.user.address || '');
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('address', address);
    if (avatar) {
      formData.append('avatar', avatar);
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Profile update failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-200">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-gray-200">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex flex-col w-64 bg-gray-900 text-white p-4">
        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-gray-300">General Info</li>
          <li className="cursor-pointer hover:text-gray-300">Personal demographic</li>
          <li className="cursor-pointer hover:text-gray-300">Verification</li>
          <li className="cursor-pointer hover:text-gray-300">Display: Dark mode</li>
          <li className="cursor-pointer hover:text-gray-300">Language</li>
          <li className="cursor-pointer hover:text-gray-300">Content media</li>
          <li className="cursor-pointer hover:text-gray-300">Sound</li>
          <li className="cursor-pointer hover:text-gray-300">Video</li>
          <li className="cursor-pointer hover:text-gray-300">Tools</li>
          <li className="cursor-pointer hover:text-gray-300">Management</li>
          <li className="cursor-pointer hover:text-gray-300">My company</li>
          <li className="cursor-pointer hover:text-gray-300">Employee</li>
          <li className="cursor-pointer hover:text-gray-300">More Apps</li>
          <li className="cursor-pointer hover:text-gray-300">Beta features</li>
        </ul>
      </div>
      <div className="border-l border-gray-700"></div>
      <div className="flex-1 p-6">
        <div className="bg-gray-800 text-white shadow-lg p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">General Info</h2>
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <img
                  src={user.avatar ? `http://localhost:3000${user.avatar}` : 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="rounded-full w-24 h-24 mb-4 border-2 border-gray-400"
                />
                <div>
                  <input
                    type="file"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="mb-4 text-gray-300"
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label className="block text-gray-300">First Name</label>
                  <input
                    type="text"
                    value={user.firstName}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Last Name</label>
                  <input
                    type="text"
                    value={user.lastName}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-800 text-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="text-white">Name: Maria Thompson</div>
            <div className="text-white">Relationship: Spouse</div>
            <div className="text-white">Email: maria.thompson@email.com</div>
            <div className="text-white">Phone: +44 7234 5678 910</div>
          </div>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">+ New Contact</button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
