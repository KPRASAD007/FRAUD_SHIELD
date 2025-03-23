import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
import Login from './pages/Login';
<<<<<<< HEAD
import Dashboard from './pages/Dashboard'; 
=======
import Signup from './pages/Signup';
>>>>>>> a4cc70ced7b8230299bed60e9597c84428c6fe9d
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
<<<<<<< HEAD
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<div className="content"><h2>Sign Up</h2><p>Signup page coming soon!</p></div>} />
        {/* Add the Dashboard route */}
       
=======
        <Route path="/signup" element={<Signup />} />
>>>>>>> a4cc70ced7b8230299bed60e9597c84428c6fe9d
      </Routes>
    </div>
  );
}

export default App;