import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFraudResult } from '../store/transactionSlice';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function TransactionSubmission() {
  const [transactionData, setTransactionData] = useState({
    amount: '',
    date: '',
    description: '',
  });
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Create a features array from transaction data (example)
    const features = [
      parseFloat(transactionData.amount) || 0,
      new Date(transactionData.date).getTime() / 1000 || 0,
      ...Array(28).fill(0), // Fill the rest with zeros to match 30 features
    ];

    try {
      const response = await fetch('http://localhost:5001/api/auth/check-fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check fraud');
      }

      dispatch(addFraudResult({
        ...data,
        accountDetails: 'Manual Submission',
        bankName: 'N/A',
      }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="transaction-submission-page">
      <h1>Submit Transaction</h1>
      <form onSubmit={handleSubmit} className="transaction-form">
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="amount">Transaction Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={transactionData.amount}
          onChange={handleChange}
          required
        />
        <label htmlFor="date">Transaction Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={transactionData.date}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={transactionData.description}
          onChange={handleChange}
        />
        <button type="submit">Submit Transaction</button>
      </form>
    </div>
  );
}

export default TransactionSubmission;