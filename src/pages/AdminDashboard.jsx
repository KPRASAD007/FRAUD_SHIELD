import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import { logout } from '../store/authSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, fraudTransactions: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/admin-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch admin stats');
        }
        setStats(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        if (err.message.includes('Invalid token')) {
          dispatch(logout());
          navigate('/login');
        }
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [token, user, navigate, dispatch]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fraud Transactions',
        data: [10, 15, 8, 12, 20, 5],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#4B5EAA' } },
      title: { display: true, text: 'Fraud Trends (Last 6 Months)', font: { size: 16 }, color: '#4B5EAA' },
      tooltip: { backgroundColor: '#1F2937', titleColor: '#fff', bodyColor: '#fff' },
    },
    scales: {
      x: { ticks: { color: '#4B5EAA' } },
      y: { ticks: { color: '#4B5EAA' }, beginAtZero: true },
    },
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          Array(3).fill().map((_, index) => (
            <Skeleton key={index} height={120} className="rounded-lg" />
          ))
        ) : (
          <>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            >
              <FaUsers className="text-blue-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            >
              <FaChartLine className="text-green-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalTransactions}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            >
              <FaChartLine className="text-red-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fraud Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.fraudTransactions}</p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Fraud Trends Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/user-management')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/transaction-history')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          View Transaction History
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;