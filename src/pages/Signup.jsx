import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false); // Show OTP field after form submit
  const [otp, setOtp] = useState(''); // OTP input value
  const [isSignupComplete, setIsSignupComplete] = useState(false); // Success state

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    let newErrors = { ...errors };
    if (name === 'username') {
      if (!value) newErrors.username = 'Username is required';
      else if (value.length < 3) newErrors.username = 'Username must be at least 3 characters';
      else if (value.length > 20) newErrors.username = 'Username cannot exceed 20 characters';
      else if (!/^[a-zA-Z0-9_]+$/.test(value)) newErrors.username = 'Username can only contain letters, numbers, and underscores';
      else delete newErrors.username;
    }
    if (name === 'email') {
      if (!value) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Invalid email format';
      else delete newErrors.email;
    }
    if (name === 'password') {
      if (!value) newErrors.password = 'Password is required';
      else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)) newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
      else delete newErrors.password;
    }
    if (name === 'confirmPassword') {
      if (!value) newErrors.confirmPassword = 'Please confirm your password';
      else if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
      else delete newErrors.confirmPassword;
    }
    if (name === 'terms') {
      if (!checked) newErrors.terms = 'You must agree to the terms';
      else delete newErrors.terms;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (formData.username.length > 20) newErrors.username = 'Username cannot exceed 20 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) newErrors.password = 'Password must include uppercase, lowercase, number, and special character';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.terms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowOtpField(true); // Show OTP field below form
      console.log('Form submitted, awaiting OTP:', formData);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && /^\d+$/.test(otp)) { // Check for 6 digits
      console.log('OTP "verified":', otp);
      setIsSignupComplete(true); // Show success message
      setShowOtpField(false); // Hide OTP field
    } else {
      setErrors({ ...errors, otp: 'Please enter a valid 6-digit OTP' });
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up for FRAUD_SHIELD</h2>
      {isSignupComplete ? (
        <div className="success-message">
          <h3>Signup Successful!</h3>
          <p>Your account has been created. <Link to="/login">Go to Login</Link></p>
        </div>
      ) : (
        <>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                maxLength="20"
                disabled={showOtpField} // Disable during OTP step
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={showOtpField}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group password-group">
              <label htmlFor="password">Password:</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={showOtpField}
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group password-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={showOtpField}
                />
                <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  disabled={showOtpField}
                /> I agree to the <a href="#terms">Terms and Conditions</a>
              </label>
              {errors.terms && <span className="error">{errors.terms}</span>}
            </div>
            {!showOtpField && (
              <button type="submit" className="signup-button">Next</button>
            )}
          </form>
          {showOtpField && (
            <form className="otp-form" onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP (sent to {formData.email}):</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
                {errors.otp && <span className="error">{errors.otp}</span>}
              </div>
              <button type="submit" className="signup-button">Verify OTP</button>
            </form>
          )}
          <p className="login-prompt">
            Already a member? <Link to="/login">Login</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default Signup;