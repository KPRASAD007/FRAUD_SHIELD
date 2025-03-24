import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function TransactionHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionData = location.state?.transactionData || [];
  const [filter, setFilter] = useState('all-time');
  const [isScanning, setIsScanning] = useState(false);
  const [fraudResults, setFraudResults] = useState({});

  // Log transactionData for debugging
  console.log('Transaction Data Received:', transactionData);

  // Mask account numbers
  const maskAccountNumber = (accountNumber) => {
    return accountNumber ? accountNumber.replace(/.(?=.{4})/g, 'x') : 'N/A';
  };

  // Filter transactions with robust date handling
  const filterTransactions = (transactions) => {
    if (!Array.isArray(transactions)) {
      console.error('transactionData is not an array:', transactions);
      return [];
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    return transactions.filter((t) => {
      const rawDate = t['Transaction Time'] || t['Time'] || '';
      const date = new Date(rawDate);
      const isValidDate = !isNaN(date.getTime());

      if (!isValidDate) {
        console.warn('Invalid date in transaction:', t);
        return filter === 'all-time'; // Include in 'all-time', skip elsewhere
      }

      switch (filter) {
        case 'this-month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;

        case 'last-month': {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }

        case 'past-6-months': {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return date >= sixMonthsAgo;
        }

        case 'all-time':
        default:
          return true;
      }
    });
  };

  // Scan transactions for fraud
  const handleScanClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsScanning(true);
    const results = {};

    const filtered = filterTransactions(transactionData);
    for (const [index, transaction] of filtered.entries()) {
      const features = {
        Time: parseFloat(transaction['Transaction Time'] || transaction['Time']) || 0,
        Amount: parseFloat(transaction.Amount) || 0,
        V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
        V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
        V21: 0, V22: 0, V23: 0, V24: 0, V25: 0, V26: 0, V27: 0, V28: 0,
      };
      const featureArray = Object.values(features);

      try {
        const response = await fetch('http://localhost:5000/api/auth/check-fraud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ features: featureArray }),
        });
        if (!response.ok) throw new Error('Fraud check failed');
        const data = await response.json();
        results[index] = data;
      } catch (err) {
        console.error(`Fraud check error for transaction ${index}:`, err);
        results[index] = { prediction: 0, probability: 0, error: err.message };
      }
    }

    setFraudResults(results);
    setIsScanning(false);
    alert('Fraud scan completed!');
  };

  const filteredTransactions = filterTransactions(transactionData);

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>

      <div className="filter-section">
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="past-6-months">Past 6 Months</option>
          <option value="all-time">All Time</option>
        </select>
      </div>

      <div className="table-container">
        {filteredTransactions.length > 0 ? (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Fraud Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{maskAccountNumber(transaction['Sender Account'])}</td>
                  <td>{maskAccountNumber(transaction['Receiver Account'])}</td>
                  <td>{transaction.Amount || 'N/A'}</td>
                  <td>{transaction['Transaction Time'] || transaction['Time'] || 'N/A'}</td>
                  <td>
                    {fraudResults[index] ? (
                      fraudResults[index].prediction === 1 ? (
                        <span className="fraud">Fraud ({(fraudResults[index].probability * 100).toFixed(2)}%)</span>
                      ) : (
                        <span className="legit">Legit ({(fraudResults[index].probability * 100).toFixed(2)}%)</span>
                      )
                    ) : (
                      'Not Scanned'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions available.</p>
        )}

        <div className="button-group">
          <button
            className="scan-button"
            onClick={handleScanClick}
            disabled={isScanning || filteredTransactions.length === 0}
          >
            {isScanning ? 'Scanning...' : 'Scan for Fraud'}
          </button>
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;