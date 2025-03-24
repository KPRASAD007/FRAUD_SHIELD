import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../store/authSlice';
import { addFraudResult, addRealTimeAlert, clearRealTimeAlerts } from '../store/transactionSlice';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [accountDetails, setAccountDetails] = useState('');
  const [bankName, setBankName] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalTransactions: 0, fraudTransactions: 0, fraudRate: 0 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { fraudResults, realTimeAlerts } = useSelector((state) => state.transactions);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5001', {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('fraudAlert', (alert) => {
      dispatch(addRealTimeAlert(alert));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      dispatch(login({ user: payload, token }));
    } catch (err) {
      console.error('Error decoding token:', err);
      dispatch(logout());
      navigate('/login');
    }
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
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
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [token, navigate]);

  const handleEnter = (e) => {
    e.preventDefault();
    if (accountDetails && bankName) {
      setShowUpload(true);
      setError('');
    } else {
      setError('Please fill in all fields');
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setError('');
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!csvFile) {
      setError('Please upload a CSV file');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('accountDetails', accountDetails);
    formData.append('bankName', bankName);

    try {
      const storedToken = localStorage.getItem('token');
      console.log('Token from Redux:', token);
      console.log('Token from localStorage:', storedToken);
      console.log('Sending request to /api/auth/check-fraud');
      const response = await fetch('http://localhost:5001/api/auth/check-fraud', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Raw response:', text);

      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          throw new Error('Failed to parse response: ' + text);
        }
        throw new Error(errorData.error || 'Failed to process CSV');
      }

      const data = JSON.parse(text);
      dispatch(addFraudResult(data));
      socket.emit('checkFraud', data);
    } catch (err) {
      console.error('Error processing CSV:', err);
      setError('Error processing CSV: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  console.log('fraudResults:', fraudResults);
  const chartData = {
    labels: fraudResults.map((_, index) => `Transaction ${index + 1}`),
    datasets: [
      {
        label: 'Fraud Score',
        data: fraudResults.map((result) => parseFloat(result.fraudScore)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };
  console.log('Chart data:', chartData);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Fraud Detection Trends' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const result = fraudResults[index];
            return [
              `Fraud Score: ${context.parsed.y}`,
              `Result: ${result.result}`,
              `Account: ${result.accountDetails}`,
              `Bank: ${result.bankName}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.25,
        },
      },
    },
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fraud Shield Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </header>
      <section className="p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.email}!</h2>
        <p className="mb-4">Role: {user.role}</p>
        <div className="mb-4 space-x-2">
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/user-management')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Manage Users
            </button>
          )}
          <button
            onClick={() => navigate('/transaction-history')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Transaction History
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-100 rounded">
              <p className="text-sm font-medium">Total Transactions</p>
              <p className="text-2xl font-bold">{stats.totalTransactions}</p>
            </div>
            <div className="p-4 bg-red-100 rounded">
              <p className="text-sm font-medium">Fraudulent Transactions</p>
              <p className="text-2xl font-bold">{stats.fraudTransactions}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded">
              <p className="text-sm font-medium">Fraud Rate</p>
              <p className="text-2xl font-bold">{stats.fraudRate}%</p>
            </div>
          </div>
        </div>

        {/* Real-Time Alerts */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Real-Time Fraud Alerts</h3>
          {realTimeAlerts.length > 0 ? (
            <ul className="list-disc pl-5">
              {realTimeAlerts.map((alert, index) => (
                <li key={index} className="text-red-600">
                  {alert.message} (Account: {alert.accountDetails})
                </li>
              ))}
            </ul>
          ) : (
            <p>No alerts at the moment.</p>
          )}
          <button
            onClick={() => dispatch(clearRealTimeAlerts())}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Clear Alerts
          </button>
        </div>

        {/* Fraud Trends Chart */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Fraud Trends</h3>
          {fraudResults.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>No fraud data to display yet.</p>
          )}
        </div>

        {/* Transaction Submission */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Check Fraud</h3>
          {!showUpload ? (
            <form onSubmit={handleEnter} className="space-y-4">
              {error && <p className="text-red-600">{error}</p>}
              <div>
                <label htmlFor="accountDetails" className="block mb-1">Account Details:</label>
                <input
                  type="text"
                  id="accountDetails"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="bankName" className="block mb-1">Bank Name:</label>
                <input
                  type="text"
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Enter
              </button>
            </form>
          ) : (
            <form onSubmit={handleProceed} className="space-y-4">
              {error && <p className="text-red-600">{error}</p>}
              <div>
                <label htmlFor="csvFile" className="block mb-1">Upload CSV File:</label>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  required
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Display Recent Fraud Results */}
        {fraudResults.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Fraud Checks</h3>
            {fraudResults.map((result, index) => (
              <div key={index} className="border-b py-2">
                <p><strong>Result:</strong> {result.result}</p>
                <p><strong>Fraud Score:</strong> {result.fraudScore}</p>
                <p><strong>Account Details:</strong> {result.accountDetails}</p>
                <p><strong>Bank Name:</strong> {result.bankName}</p>
                <p><strong>Uploaded File:</strong> {result.file}</p>
                <details>
                  <summary className="cursor-pointer text-blue-600">View Features</summary>
                  <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(result.features, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;