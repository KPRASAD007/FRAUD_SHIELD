import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Fetch user data on mount
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

  // Handle transaction input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0, // Default to 0 if invalid
    }));
  };

  // Check fraud with backend
  const handleFraudCheck = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const features = Object.values(transaction); // Convert to array of 30 features
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username} ({user.role})</h2>
      <div className="input-section">
        <h3>Check Transaction for Fraud</h3>
        <div className="input-group">
          <label>Time (seconds since first transaction):</label>
          <input
            type="number"
            name="Time"
            value={transaction.Time}
            onChange={handleInputChange}
            placeholder="e.g., 0"
          />
        </div>
        <div className="input-group">
          <label>Amount ($):</label>
          <input
            type="number"
            name="Amount"
            value={transaction.Amount}
            onChange={handleInputChange}
            placeholder="e.g., 100.00"
            step="0.01"
          />
        </div>
        {/* Simplified: Only Time and Amount for demo; V1-V28 mocked as 0 */}
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
          <h3>Fraud Detection Result</h3>
          <p className={fraudResult.prediction === 1 ? 'fraud' : 'legit'}>
            Prediction: {fraudResult.prediction === 1 ? 'Fraud Detected' : 'Legitimate Transaction'}
          </p>
          <p>Probability of Fraud: {(fraudResult.probability * 100).toFixed(2)}%</p>
        </div>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;