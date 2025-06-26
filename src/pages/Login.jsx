import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FiAlertCircle, FiCoffee, FiClock, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthForm } from '../utils';
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
    description: 'Discover special weekend and festival menus in advance.'
  }
];

const Login = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // Handle email/password sign in
  const handleEmailSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // For demo purposes, we'll just show a success message
    setTimeout(() => {
      setEmailSent(true);
      toast.success('Sign-in link would be sent to your email in production');
      setIsLoading(false);
    }, 1000);
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    // For demo purposes, we'll just navigate to home
    toast.success('Google sign-in would be handled in production');
    navigate('/');
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
            currentFeature={0} 
            setCurrentFeature={() => {}}
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