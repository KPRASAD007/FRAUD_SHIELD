import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Correct path

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>FRAUD SHIELD</span>
      </div>
      <ul className="nav-links">
        <li><button className="nav-button" onClick={() => navigate('/')}>Home</button></li>
        <li><button className="nav-button" onClick={() => navigate('/about')}>About</button></li>
        <li><button className="nav-button" onClick={() => navigate('/services')}>Services</button></li>
        <li><button className="nav-button" onClick={() => navigate('/enquiry')}>Enquiry</button></li>
        {token ? (
          <>
            <li><button className="nav-button" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><button className="nav-button" onClick={() => navigate('/login')}>Login</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;