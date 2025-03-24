// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>FRAUD SHIELD</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/enquiry">Enquiry</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* Removed Signup link */}
      </ul>
    </nav>
  );
}

export default Navbar;