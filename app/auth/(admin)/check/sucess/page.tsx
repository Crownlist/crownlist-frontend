// components/PasswordResetSuccess.js
import React from 'react';

const PasswordResetSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen  rounded-md h-full w-full max-w-md mx-auto">
      {/* Party Popper Icon (using an emoji as a simple fallback) */}
      <div className="mb-6">
        <span className="text-5xl">🎉</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
        Password reset
      </h2>

      {/* Description */}
      <p className="text-center text-gray-600 mb-8">
        Your password has been successfully reset, login to explore a world of
        trendy properties and list for you with exclusive deals
      </p>

      {/* Login Button */}
      <button
        className="bg-gray-900 text-white rounded-full px-10 py-3 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Login
      </button>
    </div>
  );
};

export default PasswordResetSuccess;