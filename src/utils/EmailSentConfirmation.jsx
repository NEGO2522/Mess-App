import { FiCheck } from 'react-icons/fi';

export const EmailSentConfirmation = ({ email, onBack }) => (
  <div className="text-center p-6 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
      <FiCheck className="h-6 w-6 text-green-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
    <p className="text-sm text-gray-500 mb-4">
      We've sent a magic link to <span className="font-medium">{email}</span>.
      Click the link to sign in.
    </p>
    <p className="text-xs text-gray-400">
      Didn't receive an email? Check your spam folder or try again.
    </p>
    <button
      onClick={onBack}
      className="mt-4 text-sm text-blue-600 hover:text-blue-500 font-medium"
    >
      Back to sign in
    </button>
  </div>
);
