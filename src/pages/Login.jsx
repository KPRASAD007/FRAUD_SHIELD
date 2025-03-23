import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login-page">
      <h2>Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup"><button className="signup-button">Sign Up</button></Link></p>
    </div>
  );
}

export default Login;