import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Corrected path

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState({
    Time: 0,
    Amount: 0,
    V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
    V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
    V21: 0, V22: 0, V23: 0, V24: 0, V25: 0, V26: 0, V27: 0, V28: 0,
  });
  const [fraudResult, setFraudResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [csvFile, setCSVFile] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleFraudCheck = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const features = [
      transaction.Time, transaction.Amount,
      transaction.V1, transaction.V2, transaction.V3, transaction.V4, transaction.V5,
      transaction.V6, transaction.V7, transaction.V8, transaction.V9, transaction.V10,
      transaction.V11, transaction.V12, transaction.V13, transaction.V14, transaction.V15,
      transaction.V16, transaction.V17, transaction.V18, transaction.V19, transaction.V20,
      transaction.V21, transaction.V22, transaction.V23, transaction.V24, transaction.V25,
      transaction.V26, transaction.V27, transaction.V28,
    ];
    try {
      const response = await fetch('http://localhost:5000/api/auth/check-fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ features }),
      });
      if (!response.ok) throw new Error('Fraud check failed');
      const data = await response.json();
      setFraudResult(data);
    } catch (err) {
      alert(err.message);
      setFraudResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Account Number:', accountNumber);
    console.log('Bank Name:', bankName);
    alert(`Account Number: ${accountNumber}\nBank Name: ${bankName}`);
    setShowContent(true);
    setShowCSVUpload(true);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      console.log('Uploaded File:', file);
      setCSVFile(file);
      setShowEnterButton(true);
      parseCSV(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      console.log('Uploaded File:', file);
      setCSVFile(file);
      setShowEnterButton(true);
      parseCSV(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split(',').map(header => header.trim());
      const data = rows.slice(1).map(row => {
        const columns = row.split(',');
        if (columns.length !== headers.length) {
          console.warn('Skipping row due to incorrect column count:', row);
          return null;
        }
        const transaction = {};
        headers.forEach((header, index) => {
          transaction[header] = columns[index] ? parseFloat(columns[index].trim()) || columns[index].trim() : 0;
        });
        return transaction;
      }).filter(transaction => transaction !== null);
      console.log('Parsed CSV Data:', data);
      setTransactionData(data);
    };
    reader.readAsText(file);
  };

  const handleEnterButtonClick = () => {
    navigate('/transaction-history', { state: { transactionData } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username} ({user.role})</h1>
      <div className="input-section">
        <h2>Check Transaction for Fraud</h2>
        <div className="input-group">
          <label htmlFor="time">Time (seconds since first transaction):</label>
          <input
            type="number"
            id="time"
            name="Time"
            value={transaction.Time}
            onChange={handleInputChange}
            placeholder="e.g., 0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount ($):</label>
          <input
            type="number"
            id="amount"
            name="Amount"
            value={transaction.Amount}
            onChange={handleInputChange}
            placeholder="e.g., 100.00"
            step="0.01"
          />
        </div>
        <p className="note">Note: Other features (V1-V28) are mocked as 0 for demo simplicity.</p>
        <button
          className="enter-button"
          onClick={handleFraudCheck}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Fraud'}
        </button>
      </div>
      {fraudResult && (
        <div className="fraud-result">
          <h2>Fraud Detection Result</h2>
          <p className={fraudResult.prediction === 1 ? 'fraud' : 'legit'}>
            Prediction: {fraudResult.prediction === 1 ? 'Fraud Detected' : 'Legitimate Transaction'}
          </p>
          <p>Probability of Fraud: {(fraudResult.probability * 100).toFixed(2)}%</p>
        </div>
      )}
      <div className="input-section">
        <h2>Enter Account Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g., 1234567890"
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
              placeholder="e.g., XYZ Bank"
              required
            />
          </div>
          <button type="submit" className="enter-button">Enter</button>
        </form>
      </div>
      {showContent && showCSVUpload && (
        <div className="csv-upload-section">
          <h2>Upload Transaction CSV</h2>
          <div
            className="csv-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {csvFile ? (
              <p>One file uploaded: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)</p>
            ) : (
              <>
                <p>Drag and drop a CSV file here, or</p>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="csvFile" className="csv-upload-button">
                  Upload from Computer
                </label>
              </>
            )}
          </div>
          {showEnterButton && (
            <button className="proceed-button" onClick={handleEnterButtonClick}>
              Proceed
            </button>
          )}
        </div>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;