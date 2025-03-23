import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [showContent, setShowContent] = useState(false); // State to control content visibility
  const [showCSVUpload, setShowCSVUpload] = useState(false); // State to control CSV upload visibility
  const [csvFile, setCSVFile] = useState(null); // State to store the uploaded CSV file
  const [transactionData, setTransactionData] = useState([]); // State to store parsed CSV data
  const [showEnterButton, setShowEnterButton] = useState(false); // State to control Enter button visibility
  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Account Number:', accountNumber);
    console.log('Bank Name:', bankName);
    alert(`Account Number: ${accountNumber}\nBank Name: ${bankName}`);
    setShowContent(true); // Show content after clicking Enter
    setShowCSVUpload(true); // Show CSV upload section
  };

  // Handle CSV file upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      console.log('Uploaded File:', file); // Log uploaded file
      setCSVFile(file);
      setShowEnterButton(true); // Show Enter button after CSV upload
      parseCSV(file); // Parse the CSV file
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      console.log('Uploaded File:', file); // Log uploaded file
      setCSVFile(file);
      setShowEnterButton(true); // Show Enter button after CSV upload
      parseCSV(file); // Parse the CSV file
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  // Prevent default behavior for drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Parse CSV file
  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== ''); // Remove empty rows
      const headers = rows[0].split(',').map(header => header.trim()); // First row is headers

      const data = rows.slice(1).map((row) => {
        const columns = row.split(',');

        // Skip rows with incorrect column count
        if (columns.length !== headers.length) {
          console.warn('Skipping row due to incorrect column count:', row);
          return null;
        }

        const transaction = {};
        headers.forEach((header, index) => {
          transaction[header] = columns[index] ? columns[index].trim() : ''; // Handle undefined values
        });
        return transaction;
      }).filter(transaction => transaction !== null); // Remove null entries

      console.log('Parsed CSV Data:', data); // Log parsed data
      setTransactionData(data); // Store parsed data
    };
    reader.readAsText(file);
  };

  // Handle Enter button click after CSV upload
  const handleEnterButtonClick = () => {
    // Navigate to the TransactionHistory page with transaction data
    navigate('/transaction-history', { state: { transactionData } });
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
          {/* CSV Upload Section */}
          {showCSVUpload && (
            <div className="csv-upload-section">
              <h2>Upload CSV File</h2>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;