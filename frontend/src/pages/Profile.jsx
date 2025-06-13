import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUserData, logout } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id) {
        throw new Error('User not found');
      }

      // Fetch user rewards and data
      const rewardsResponse = await fetch(`https://eco-commerce-2vxl.onrender.com/user/${storedUser.id}/rewards`);
      if (!rewardsResponse.ok) {
        throw new Error('Failed to fetch user rewards');
      }
      const rewardsData = await rewardsResponse.json();
      
      // Update user data with rewards
      const updatedUserData = {
        ...storedUser,
        rewardPoints: rewardsData.rewardPoints
      };
      setUserData(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      // Fetch order history
      const ordersResponse = await fetch(`https://eco-commerce-2vxl.onrender.com/orders/history/${storedUser.id}`);
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch order history');
      }
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id) {
        throw new Error('User not found');
      }

      const response = await fetch(`https://eco-commerce-2vxl.onrender.com/user/${storedUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Call logout from store
      logout();
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Account Settings
          </button>
        </div>

        {/* Profile Information */}
        {activeTab === 'profile' && userData && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {userData.name?.charAt(0) || userData.email.charAt(0)}
                </span>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-semibold">{userData.name || 'User'}</h2>
                <p className="text-gray-600">{userData.email}</p>
                <p className="text-sm text-gray-500">Reward Points: {userData.rewardPoints || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order History */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            {!orders || orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="p-6 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order._id}</h3>
                      <p className="text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </div>
                  {order.products && order.products.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.products.map((product, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{product.name} x {product.quantity}</span>
                            <span>${(product.price * product.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="font-semibold">Total: ${order.totalPrice?.toFixed(2) || '0.00'}</p>
                    {order.totalCarbonFootprint && (
                      <p className="text-sm text-gray-500">
                        Carbon Footprint: {order.totalCarbonFootprint.toFixed(2)} kg CO₂
                      </p>
                    )}
                    {order.rewardPoints && (
                      <p className="text-sm text-green-600">
                        Earned {order.rewardPoints} reward points
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full p-2 border rounded"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 border rounded"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full p-2 border rounded"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
              <div className="pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={isLoading}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 