import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="shield-emblem"></div>
        <h1>FRAUD_SHIELD</h1>
      </div>
      <div className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/services">SERVICES</Link>
        <Link to="/enquiry">ENQUIRY</Link>
        <Link to="/login">LOGIN</Link>
      </div>
    </nav>
  );
}

export default Navbar;