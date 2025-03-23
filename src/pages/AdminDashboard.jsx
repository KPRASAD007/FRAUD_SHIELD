import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [signupLogs, setSignupLogs] = useState([]);
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

  // Fetch user data and signup logs on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user info
    fetch('http://localhost:5000/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data.role !== 'admin') throw new Error('Not an admin');
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });

    // Fetch signup logs
    fetch('http://localhost:5000/api/auth/signup-logs', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then(data => setSignupLogs(data))
      .catch(err => console.error(err.message));
  }, [navigate]);

  // Handle transaction input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
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
    const features = Object.values(transaction);
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
      <h2>Welcome, {user.username} (Admin)</h2>
      
      {/* Signup Logs Section */}
      <div className="signup-logs-section">
        <h3>Recent Signup Activity</h3>
        {signupLogs.length > 0 ? (
          <table className="transaction-history">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {signupLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.user_id}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No signup activity yet.</p>
        )}
      </div>

      {/* Fraud Check Section */}
      <div className="input-section">
        <h3>Admin Fraud Check</h3>
        <div className="input-group">
          <label>Time (seconds):</label>
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
        <p className="note">Note: V1-V28 are mocked as 0 for demo purposes.</p>
        <button
          className="enter-button"
          onClick={handleFraudCheck}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Fraud'}
        </button>
      </div>

      {/* Fraud Result */}
      {fraudResult && (
        <div className="fraud-result">
          <h3>Fraud Detection Result</h3>
          <p className={fraudResult.prediction === 1 ? 'fraud' : 'legit'}>
            Prediction: {fraudResult.prediction === 1 ? 'Fraud Detected' : 'Legitimate Transaction'}
          </p>
          <p>Probability of Fraud: {(fraudResult.probability * 100).toFixed(2)}%</p>
        </div>
      )}

      {/* Logout */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;