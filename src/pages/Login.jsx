import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FiAlertCircle, FiCoffee, FiClock, FiSun } from 'react-icons/fi';
import { 
  auth, 
  signInWithGoogle, 
  sendSignInLink, 
  isSignInLinkUrl, 
  signInWithEmail,
  onAuthStateChanged
} from '../firebase/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthForm } from '../components/Auth/AuthForm';
import { GoogleSignInButton } from '../components/Auth/GoogleSignInButton';

import { FeatureCarousel } from '../components/Auth/FeatureCarousel';
import { EmailSentConfirmation } from '../components/Auth/EmailSentConfirmation';
import { Divider } from '../components/UI/Divider';

const features = [
  {
    icon: <FiClock className="w-6 h-6" />,
    title: 'Track Your Meals',
    description: 'Never miss your favorite dishes with our daily updated menu.'
  },
  {
    icon: <FiSun className="w-6 h-6" />,
    title: 'Daily Updates',
    description: 'Get real-time updates about menu changes and special meals.'
  },
  {
    icon: <FiCoffee className="w-6 h-6" />,
    title: 'Special Menus',
    title: 'Special Menus',
    description: 'Discover special weekend and festival menus in advance.'
  }
];

const Login = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();
  
  // Check for email link on component mount
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInLinkUrl()) {
        setIsSubmitting(true);
        const emailForSignIn = window.localStorage.getItem('emailForSignIn');
        
        try {
          const { success, user, error } = await signInWithEmail(emailForSignIn);
          
          if (success) {
            // Set auth token in localStorage
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            
            toast.success('Successfully signed in!');
            // Force a page reload to ensure auth state is properly updated
            window.location.href = '/home';
          } else {
            setLoginError(error?.message || 'Failed to sign in with email link');
            toast.error('Failed to sign in with email link');
          }
        } catch (error) {
          console.error('Error signing in with email link:', error);
          setLoginError(error.message || 'Failed to sign in with email link');
          toast.error('Failed to sign in with email link');
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    
    checkEmailLink();
  }, [navigate]);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle email link login
  const handleSendSignInLink = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setLoginError('');
    
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setLoginError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Send sign in link to email
      const { success, error } = await sendSignInLink(email);
      
      if (success) {
        setIsEmailSent(true);
        toast.success('Login link sent to your email!');
      } else {
        throw error;
      }
      
    } catch (error) {
      console.error('Error sending sign in link:', error);
      const errorMessage = error?.message || 'Failed to send login link. Please try again.';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const { success, error, redirecting } = await signInWithGoogle();
      
      if (success && !redirecting) {
        toast.success('Successfully logged in with Google!');
        navigate('/home');
      } else if (error) throw error;
      // If redirecting, the page will reload and the auth state will be handled by App.jsx
    } catch (error) {
      console.error('Google sign in error:', error);
      const errorMessage = error.message || 'Failed to sign in with Google';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (!isSubmitting) setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (loginError) setLoginError('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (currentUser) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Mess Image and Features - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 p-8 md:p-12 lg:p-16 flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="text-2xl font-bold text-blue-600 mb-8 inline-block">
            Mess App
          </Link>
          
          <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
            <img 
              src="https://im.whatshot.in/img/2020/May/punjabi-mess-3-cropped-1568798950-1590740061.jpg" 
              alt="Delicious Mess Food"
              className="w-full h-auto object-cover"
            />
          </div>
          <FeatureCarousel 
            features={features} 
            currentFeature={currentFeature} 
            setCurrentFeature={setCurrentFeature} 
          />
        </div>
      </div>

      {/* Right side - Login form - Full width on mobile */}
      <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Show app name on mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Mess App
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEmailSent ? 'Check your email' : 'Welcome back'}
            </h1>
            <p className="text-gray-600">
              {isEmailSent 
                ? `We've sent a magic link to ${email}. Click the link to sign in.`
                : 'Sign in to continue to your account'}
            </p>
          </div>

          {/* Google Sign In Button */}
          <Divider />

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

          {!isEmailSent ? (
            <>
              <AuthForm 
                email={email}
                setEmail={handleEmailChange}
                onSubmit={handleSendSignInLink}
                isSubmitting={isSubmitting}
                loginError={loginError}
              />

              <Divider text="or continue with" />

              <div className="space-y-4 mt-6">
                <GoogleSignInButton 
                  onClick={handleGoogleSignIn} 
                  disabled={isSubmitting} 
                />
              </div>
            </>
          ) : (
            <EmailSentConfirmation 
              email={email}
              onBack={() => {
                setIsEmailSent(false);
                setLoginError('');
              }}
            />
          )}

          {!isEmailSent && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;