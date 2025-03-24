import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { logout } from '../store/authSlice';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch users');
        }
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        if (err.message.includes('Invalid token')) {
          dispatch(logout());
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, user, navigate, dispatch]);

  useEffect(() => {
    const filtered = users.filter((u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5001/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setFilteredUsers(filteredUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success('Role updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      if (err.message.includes('Invalid token')) {
        dispatch(logout());
        navigate('/login');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      setUsers(users.filter((u) => u.id !== userId));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userId));
      toast.success('User deleted successfully!');
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      if (err.message.includes('Invalid token')) {
        dispatch(logout());
        navigate('/login');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">User Management</h2>
      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <Skeleton count={5} height={50} className="mb-2" />
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 text-center">No users found.</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Email</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Role</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u, index) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-100">{u.email}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={u.id === user.id}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deleteLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition-colors disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;