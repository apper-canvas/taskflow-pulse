import React from 'react';

const Label = ({ children, htmlFor, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}>
      {children}
    </label>
  );
};

export default Label;