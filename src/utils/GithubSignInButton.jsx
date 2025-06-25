import { FaGithub } from 'react-icons/fa';

const GithubSignInButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${
        disabled ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      <FaGithub className="w-5 h-5 mr-2" />
      Continue with GitHub
    </button>
  );
};

export default GithubSignInButton;
