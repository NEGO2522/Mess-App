import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RulesPage from './pages/RulesPage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // For demo purposes, we'll consider the user always authenticated
  const isAuthenticated = true;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App component that wraps everything with Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  // For demo purposes, we'll consider the user always authenticated
  const isAuthenticated = true;

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} />
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rules"
          element={
            <ProtectedRoute>
              <RulesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
