import React from 'react';

const Textarea = ({ value, onChange, placeholder, rows = 3, className = '' }) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none";

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${baseClasses} ${className}`}
    />
  );
};

export default Textarea;