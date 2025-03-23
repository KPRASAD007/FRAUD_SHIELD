import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory'; // Import the new component
import Signup from './pages/Signup';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Check login state
  return isLoggedIn ? children : <Navigate to="/login" replace />; // Redirect to login if not logged in
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction-history" element={<TransactionHistory />} /> {/* New route */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;