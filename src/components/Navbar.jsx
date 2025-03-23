import React from 'react';
import { Link } from 'react-router-dom';
import paymentSecurity from '../assets/payment-security.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={paymentSecurity} alt="FRAUD_SHIELD Emblem" className="shield-emblem" />
        <h1>FRAUD_SHIELD</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/services">SERVICES</Link></li>
        <li><Link to="/enquiry">ENQUIRY</Link></li>
        <li><Link to="/login">LOGIN</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;