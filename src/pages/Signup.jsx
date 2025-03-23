import React, { useState } from 'react';

function Signup() {
  const [step, setStep] = useState(1);

  return (
    <div className="signup-page">
      <div className="signup-banner">
        <h3>Secure Your Finances Today</h3>
      </div>
      <div className="signup-card">
        <h2>Sign Up</h2>
        <div className="step-indicator">
          <span className={step === 1 ? 'active' : ''}>1. Account Details</span>
          <span className={step === 2 ? 'active' : ''}>2. Verify OTP</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: step === 1 ? '50%' : '100%' }}></div>
        </div>
        {step === 1 ? (
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input type="text" id="username" name="username" placeholder="Enter username" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input type="email" id="email" name="email" placeholder="Enter email" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" id="password" name="password" placeholder="Enter password" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm password" />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="terms" name="terms" />
              <label htmlFor="terms">I agree to the <a href="#">Terms and Conditions</a></label>
            </div>
            <button type="submit" className="signup-button" onClick={(e) => { e.preventDefault(); setStep(2); }}>Sign Up</button>
          </form>
        ) : (
          <div className="success-message">
            <h2>OTP Sent!</h2>
            <p>Check your email for the OTP to complete signup.</p>
            <button className="signup-button" onClick={() => setStep(1)}>Back to Form</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;