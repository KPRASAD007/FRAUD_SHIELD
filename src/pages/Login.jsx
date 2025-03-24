// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Install react-icons

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please check the console and ensure the backend is running.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Welcome to FRAUD SHIELD</h1>
          <p className="login-subtitle">Securely log in to protect your transactions</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>
          <button className="login-button" type="submit">Login</button>
          <p className="signup-prompt">
            Don’t have an account?{' '}
            <Link className="signup-link" to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;