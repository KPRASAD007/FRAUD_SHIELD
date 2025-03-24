import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionSubmission from './pages/TransactionSubmission';
import UserManagement from './pages/UserManagement';
import TransactionHistory from './pages/TransactionHistory';
import './App.css';

function App() {
  return (
    // Remove <Router> wrapper, since it's already in main.jsx
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transaction-submission" element={<TransactionSubmission />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/transaction-history" element={<TransactionHistory />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;