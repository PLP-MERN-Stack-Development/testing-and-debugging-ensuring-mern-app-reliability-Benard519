import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/Button';
import Card from './components/Card';
import { userAPI } from './services/api';

/**
 * Main App Component
 * Demonstrates component usage and API integration
 */
function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.register(formData);
      console.log('User registered:', response.data);
      // Reset form
      setFormData({ name: '', email: '', password: '' });
      // Refresh users list
      await fetchUsers();
      alert('User registered successfully!');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            MERN Testing & Debugging Demo
          </h1>

          {/* Registration Form */}
          <Card title="Register New User" className="mb-6">
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Register
                </Button>
              </div>
            </form>
          </Card>

          {/* Users List */}
          <Card title="Users List">
            {loading && !users.length ? (
              <p className="text-gray-600">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-600">No users found. Register a user to get started.</p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id || user.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {user.role || 'user'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button
                variant="secondary"
                size="small"
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh Users
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

