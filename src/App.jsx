import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar from components/
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
import TransactionHistory from './pages/TransactionHistory';
import './styles.css'; // Correct path from src/

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar /> {/* Add Navbar here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;