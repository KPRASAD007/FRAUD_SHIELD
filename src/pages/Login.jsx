import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login-page">
      <h2>Login into your account</h2>
      <form className="login-form">
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder="Username" />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="Password" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="signup-prompt">
        Not a member? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;