import { FcGoogle } from 'react-icons/fc';

export const GoogleSignInButton = ({ onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
  >
    <FcGoogle className="w-5 h-5 mr-2" />
    Continue with Google
  </button>
);
