import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { logout } from '../store/authSlice';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch transactions');
        }
        setTransactions(data);
        setFilteredTransactions(data);
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

    fetchTransactions();
  }, [token, navigate, dispatch]);

  useEffect(() => {
    let filtered = [...transactions];

    // Search by account details
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.accountDetails.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((t) => t.result === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const fieldA = sortField === 'date' ? new Date(a.createdAt) : a[sortField];
      const fieldB = sortField === 'date' ? new Date(b.createdAt) : b[sortField];
      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortField, sortOrder, transactions]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Transaction History</h2>
      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by account details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Fraud">Fraud</option>
            <option value="Safe">Safe</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <Skeleton count={5} height={50} className="mb-2" />
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 text-center">No transactions found.</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                    Date
                    <button onClick={() => handleSort('date')} className="ml-2">
                      <FaSort className={sortField === 'date' ? 'text-blue-500' : 'text-gray-500'} />
                    </button>
                  </th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Account Details</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Bank Name</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                    Fraud Score
                    <button onClick={() => handleSort('fraudScore')} className="ml-2">
                      <FaSort className={sortField === 'fraudScore' ? 'text-blue-500' : 'text-gray-500'} />
                    </button>
                  </th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Result</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t, index) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">{t.accountDetails}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">{t.bankName}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">{t.fraudScore}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          t.result === 'Fraud'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {t.result}
                      </span>
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
    </div>
  );
}

export default TransactionHistory;