import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', error, onFocus }) => {
  const baseClasses = "w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";
  const errorClass = error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600';

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${errorClass} ${className}`}
      onFocus={onFocus}
    />
  );
};

export default Input;