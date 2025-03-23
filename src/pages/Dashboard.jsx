import React, { useState } from 'react';

const Dashboard = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [showContent, setShowContent] = useState(false); // State to control content visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API or display it)
    console.log('Account Number:', accountNumber);
    console.log('Bank Name:', bankName);
    setShowContent(true); // Show content after clicking Enter
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>

      {/* Two-column layout for account number and bank name */}
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="bankName">Bank Name:</label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              required
            />
          </div>
          <button type="submit" className="enter-button">Enter</button>
        </form>
      </div>

      {/* Conditionally render content after clicking Enter */}
      {showContent && (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card">
              <h2>Total Transactions</h2>
              <p>0</p>
            </div>
            <div className="card">
              <h2>Fraud Alerts</h2>
              <p>0</p>
            </div>
            <div className="card">
              <h2>Successful Transactions</h2>
              <p>0</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="transaction-history">
            <h2>Transaction History</h2>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>User ID</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows will be added dynamically */}
              </tbody>
            </table>
          </div>

          {/* Logout Button */}
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;