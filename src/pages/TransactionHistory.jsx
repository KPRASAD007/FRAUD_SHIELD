import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const TransactionHistory = () => {
  const location = useLocation();
  const transactionData = location.state?.transactionData || []; // Get transaction data from state
  const [filter, setFilter] = useState('all-time'); // State to manage the selected filter
  const [isScanning, setIsScanning] = useState(false); // State to track if scanning is in progress

  // Function to mask account numbers
  const maskAccountNumber = (accountNumber) => {
    return accountNumber.replace(/.(?=.{4})/g, 'x'); // Mask all but the last 4 digits
  };

  // Function to filter transactions based on the selected filter
  const filterTransactions = (transactions) => {
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
    const currentYear = currentDate.getFullYear(); // Get the current year

    switch (filter) {
      case 'this-month':
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction['Transaction Time']);
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });

      case 'last-month':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January edge case
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction['Transaction Time']);
          return (
            transactionDate.getMonth() === lastMonth &&
            transactionDate.getFullYear() === lastMonthYear
          );
        });

      case 'past-6-months':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Subtract 6 months from the current date
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction['Transaction Time']);
          return transactionDate >= sixMonthsAgo;
        });

      case 'all-time':
      default:
        return transactions;
    }
  };

  // Function to handle the scan button click
  const handleScanClick = async () => {
    setIsScanning(true); // Start scanning
    try {
      // Call the backend API to scan for fraud
      const response = await fetch('/api/scan-fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions: transactionData }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Scan complete: ${result.message}`);
      } else {
        throw new Error('Failed to scan for fraud');
      }
    } catch (error) {
      console.error('Error scanning for fraud:', error);
      alert('An error occurred while scanning for fraud.');
    } finally {
      setIsScanning(false); // Stop scanning
    }
  };

  // Get filtered transactions based on the selected filter
  const filteredTransactions = filterTransactions(transactionData);

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>

      {/* Filter Dropdown */}
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

      {/* Transaction Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{maskAccountNumber(transaction['Sender Account'])}</td>
                <td>{maskAccountNumber(transaction['Receiver Account'])}</td>
                <td>{transaction.Amount}</td>
                <td>{transaction['Transaction Time']}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Scan Button */}
        <button
          className="scan-button"
          onClick={handleScanClick}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Scan for Fraud'}
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;