import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FiAlertCircle, FiCoffee, FiClock, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthForm } from '../utils';
import { Divider } from '../components/UI/Divider';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import {
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged
} from "firebase/auth";

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
    description: 'Discover special weekend and festival menus in advance.'
  }
];

// Animated FeatureCarousel
const FeatureCarousel = ({ features, currentFeature, setCurrentFeature }) => (
  <div className="mt-8 relative h-32">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentFeature}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100"
      >
        <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-blue-100 text-blue-600">
          {features[currentFeature].icon}
        </div>
        <div className="font-semibold">{features[currentFeature].title}</div>
        <div className="text-xs text-gray-500 text-center">{features[currentFeature].description}</div>
      </motion.div>
    </AnimatePresence>
    <div className="flex justify-center mt-6 space-x-2 relative z-10">
      {features.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentFeature(idx)}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            idx === currentFeature ? 'bg-blue-600 w-6' : 'bg-gray-300'
          }`}
          aria-label={`Go to feature ${idx + 1}`}
        />
      ))}
    </div>
  </div>
);

const GoogleSignInButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
    style={{ boxShadow: '0 1px 2px rgba(60,64,67,.08)' }}
  >
    <span className="mr-2 flex items-center">
      <svg width="20" height="20" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.6 0 5 .8 7 2.3l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20.5-8.5 20.5-20.5 0-1.4-.1-2.7-.4-4z"/>
          <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.6 0 5 .8 7 2.3l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5c-7.1 0-13.2 3.6-16.7 9.2z"/>
          <path fill="#FBBC05" d="M24 45.5c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2c-2 1.4-4.5 2.2-7.4 2.2-5.6 0-10.3-3.8-12-8.9l-6.6 5.1C7.1 41.4 14.9 45.5 24 45.5z"/>
          <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.6 5.2-6.6 6.2l6.4 5.2c3.7-3.4 6-8.4 6-14.4 0-1.4-.1-2.7-.4-4z"/>
        </g>
      </svg>
    </span>
    Continue with Google
  </button>
);

const EmailSentConfirmation = ({ email, onBack }) => (
  <div className="text-center">
    <p>We've sent a sign-in link to {email}.</p>
    <button onClick={onBack} className="mt-4 text-blue-600 underline">Back</button>
  </div>
);

const actionCodeSettings = {
  url: window.location.origin + '/home',
  handleCodeInApp: true,
};

const Login = ({ setIsAuthenticated }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  // Animate features one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, [setIsAuthenticated]);

  // Handle email link sign-in
  const handleSendSignInLink = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
      setIsEmailSent(true);
      toast.success('Sign-in link sent to your email');
    } catch (error) {
      setLoginError(error.message);
    }
    setIsSubmitting(false);
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      navigate('/home');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Complete email link sign-in if user clicks the link from email
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            setIsAuthenticated(true);
            navigate('/home');
          })
          .catch((error) => {
            setLoginError(error.message);
          });
      }
    }
    // eslint-disable-next-line
  }, []);

  if (loading)
    return (
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
              {emailSent ? 'Check your email' : 'Welcome back'}
            </h1>
            <p className="text-gray-600">
              {emailSent
                ? `We've sent a sign-in link to ${email}.`
                : 'Sign in to continue to your account'}
            </p>
          </div>

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
                setEmail={setEmail} // <-- This makes the email input editable
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
                setEmailSent(false);
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