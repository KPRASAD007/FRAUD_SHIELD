import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaUser, FaChartLine, FaExclamationTriangle, FaUpload } from 'react-icons/fa';
import realTimeDetection from '../assets/realtime-detection.jpg';
import { logout } from '../store/authSlice';
import { addFraudResult, addRealTimeAlert, clearRealTimeAlerts } from '../store/transactionSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const transactionSchema = z.object({
  accountDetails: z.string().nonempty('Account details are required'),
  bankName: z.string().nonempty('Bank name is required'),
  csvFile: z.any().refine((file) => file instanceof File, 'Please upload a CSV file'),
});

function Dashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ totalTransactions: 0, fraudTransactions: 0, fraudRate: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { fraudResults, realTimeAlerts } = useSelector((state) => state.transactions);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const socket = io('http://localhost:5001', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('fraudAlert', (alert) => {
      dispatch(addRealTimeAlert(alert));
      toast.error(`Fraud Alert: ${alert.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, navigate, dispatch]);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
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
  }, [token, dispatch, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('csvFile', data.csvFile);
    formData.append('accountDetails', data.accountDetails);
    formData.append('bankName', data.bankName);

    try {
      const response = await fetch('http://localhost:5001/api/auth/check-fraud', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Fraud check failed');
      }
      dispatch(addFraudResult(result));
      toast.success('Transaction submitted successfully!');
      reset();
      setShowUpload(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue('csvFile', file);
  };

  const chartData = {
    labels: fraudResults.map((_, index) => `Transaction ${index + 1}`),
    datasets: [
      {
        label: 'Fraud Score',
        data: fraudResults.map((result) => result.fraudScore),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#4B5EAA' } },
      title: { display: true, text: 'Fraud Score Trend', font: { size: 16 }, color: '#4B5EAA' },
      tooltip: { backgroundColor: '#1F2937', titleColor: '#fff', bodyColor: '#fff' },
    },
    scales: {
      x: { ticks: { color: '#4B5EAA' } },
      y: { ticks: { color: '#4B5EAA' }, beginAtZero: true },
    },
  };

  const paginatedResults = fraudResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(fraudResults.length / itemsPerPage);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      // Placeholder for profile update (no backend changes)
      toast.success('Profile updated successfully!');
      setShowProfile(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome, {user.email}
        </h2>
        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          <FaUser className="mr-2" />
          Profile
        </button>
      </div>

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
              <FaChartLine className="text-blue-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalTransactions}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            >
              <FaExclamationTriangle className="text-red-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fraud Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.fraudTransactions}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            >
              <FaChartLine className="text-yellow-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fraud Rate</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.fraudRate}%</p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Upload Transaction Form */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <FaUpload className="mr-2" />
          {showUpload ? 'Cancel' : 'Upload Transaction'}
        </button>
      </div>
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="accountDetails" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Details
              </label>
              <input
                type="text"
                id="accountDetails"
                {...register('accountDetails')}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account details"
              />
              {errors.accountDetails && <p className="mt-1 text-sm text-red-600">{errors.accountDetails.message}</p>}
            </div>
            <div>
              <label htmlFor="bankName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                {...register('bankName')}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
              />
              {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>}
            </div>
            <div>
              <label htmlFor="csvFile" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload CSV
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {errors.csvFile && <p className="mt-1 text-sm text-red-600">{errors.csvFile.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isLoading || isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </motion.div>
      )}

      {/* Real-Time Alerts */}
      {realTimeAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg shadow-lg relative"
        >
          <img src={realTimeDetection} alt="Real-Time Detection" className="absolute inset-0 w-full h-full object-cover opacity-10" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Real-Time Alerts</h3>
            {realTimeAlerts.map((alert, index) => (
              <p key={index} className="text-yellow-800 dark:text-yellow-200 mb-2">
                {alert.message} - Account: {alert.accountDetails}
              </p>
            ))}
            <button
              onClick={() => {
                dispatch(clearRealTimeAlerts());
                toast.success('Alerts cleared!');
              }}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Clear Alerts
            </button>
          </div>
        </motion.div>
      )}

      {/* Fraud Check Results */}
      {fraudResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Fraud Check Results</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">Result</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">Fraud Score</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">Account Details</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">Bank Name</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.map((result, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b dark:border-gray-700"
                >
                  <td className="p-3 text-gray-900 dark:text-gray-100">{result.result}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{result.fraudScore}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{result.accountDetails}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{result.bankName}</td>
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
        </div>
      )}

      {/* Fraud Score Chart */}
      {fraudResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition-colors disabled:opacity-50"
                >
                  {profileLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;