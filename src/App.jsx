import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
import TransactionHistory from './pages/TransactionHistory';
import './styles.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (requireAdmin && decoded.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

const NotFound = () => (
  <div className="not-found">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you’re looking for doesn’t exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/transaction-history"
            element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;