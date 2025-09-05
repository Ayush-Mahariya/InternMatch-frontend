import React from 'react';

const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default Input;
