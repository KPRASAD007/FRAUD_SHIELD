import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
<<<<<<< HEAD
import './styles.css';
=======
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory'; // Import the new component
import Signup from './pages/Signup';
>>>>>>> b6acf3cefad430f93aa14d44db7f0c7b00ca8ca4
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/enquiry" element={<Enquiry />} />
        </Routes>
      </div>
    </Router>
=======
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
>>>>>>> b6acf3cefad430f93aa14d44db7f0c7b00ca8ca4
  );
}

export default App;