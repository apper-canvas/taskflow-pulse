import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ children, onClick, className = '', icon, type = 'button', disabled = false }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900";

  const getVariantClasses = () => {
    if (className.includes('primary')) {
      return 'bg-primary hover:bg-primary-dark text-white';
    }
    if (className.includes('secondary')) {
      return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
    }
    if (className.includes('icon')) {
      return 'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white';
    }
    if (className.includes('toggle-check')) {
      return 'mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors focus-ring';
    }
    if (className.includes('text-primary')) {
      return 'text-sm text-primary hover:text-primary-dark';
    }
    if (className.includes('link')) {
      return 'p-1 text-gray-400 hover:text-primary transition-colors';
    }
    if (className.includes('delete')) {
      return 'p-1 text-gray-400 hover:text-red-500 transition-colors';
    }
    // Default or fallback variant
    return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
  };

  const finalClasses = `${baseClasses} ${getVariantClasses()} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={finalClasses}
      disabled={disabled}
    >
      {icon && <ApperIcon name={icon} className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;