// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Install react-icons

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return '';
    if (pwd.length < 6) return 'Weak';
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return 'Moderate';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Join FRAUD SHIELD</h1>
          <p className="signup-subtitle">Create an account to secure your transactions</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
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
              className="signup-input"
            />
            {passwordStrength && (
              <span className={`password-strength ${passwordStrength.toLowerCase()}`}>
                {passwordStrength}
              </span>
            )}
          </div>
          <button className="signup-button" type="submit">Sign Up</button>
          <p className="login-prompt">
            Already have an account?{' '}
            <Link className="login-link" to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;