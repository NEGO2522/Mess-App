import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, handleRedirectResult } from './firebase/firebase';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RulesPage from './pages/RulesPage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Handle redirect result after authentication
  useEffect(() => {
    let isMounted = true;
    
    const checkRedirectResult = async () => {
      // Skip if we're not in a loading state or component is unmounted
      if (!isLoading || !isMounted) return;
      
      try {
        console.log('Checking for authentication redirect...');
        const { success, redirectUrl, error, isNotRedirect } = await handleRedirectResult();
        
        // Skip if component was unmounted
        if (!isMounted) return;
        
        if (isNotRedirect) {
          console.log('Not in an authentication redirect flow');
          setIsLoading(false);
          return;
        }
        
        if (success && redirectUrl) {
          console.log('Authentication successful, redirecting to:', redirectUrl);
          toast.success('Successfully logged in!');
          
          // Small delay to ensure toast is visible
          setTimeout(() => {
            if (isMounted) {
              navigate(redirectUrl, { replace: true });
            }
          }, 500);
        } else if (error) {
          console.error('Error handling authentication redirect:', error);
          // Only show error toast if it's not a cancelled auth flow
          const silentErrors = [
            'auth/popup-closed-by-user',
            'auth/cancelled-popup-request',
            'auth/popup-blocked',
            'auth/redirect-cancelled-by-user'
          ];
          
          if (error.code && !silentErrors.includes(error.code)) {
            toast.error(error.message || 'Failed to complete sign in');
          }
        }
      } catch (error) {
        console.error('Unexpected error in authentication flow:', error);
        if (process.env.NODE_ENV !== 'production') {
          console.error('Full error details:', error);
        }
        
        // Don't show error toast for expected errors
        if (error?.code && !['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked'].includes(error.code)) {
          toast.error('An unexpected error occurred during sign in');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Only check for redirect result if we're in a loading state
    if (isLoading) {
      console.log('Initializing authentication check...');
      checkRedirectResult();
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [navigate, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/rules" element={<RulesPage />} />
        {/* Add more public routes here */}
      </Routes>
    </div>
  );
}

export default AppWrapper;
