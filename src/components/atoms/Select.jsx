import React from 'react';

const Select = ({ value, onChange, options, className = '' }) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";

  return (
    <select
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;