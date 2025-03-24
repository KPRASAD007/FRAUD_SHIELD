import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import store from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Enquiry from './pages/Enquiry';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import TransactionHistory from './pages/TransactionHistory';
import TransactionSubmission from './pages/TransactionSubmission';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute role="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction-history"
              element={
                <ProtectedRoute>
                  <TransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction-submission"
              element={
                <ProtectedRoute>
                  <TransactionSubmission />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;