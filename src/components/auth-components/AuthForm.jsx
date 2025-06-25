import React from 'react';
import { FiMail, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export const AuthForm = ({ email, setEmail, onSubmit, isSubmitting, loginError }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email address
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiMail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
      </div>
      {loginError && (
        <p className="mt-1 text-sm text-red-600">{loginError}</p>
      )}
    </div>

    <div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
          isSubmitting || !email ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending link...
          </>
        ) : (
          <>
            Send login link
            <FiArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </div>
  </form>
);
