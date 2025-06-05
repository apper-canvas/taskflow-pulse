import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ children, priority, icon, className, onClick }) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1';
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
    medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700',
    low: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  };

  const statusColors = {
    overdue: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
    due: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
  }

  let finalClasses = baseClasses;

  if (priority) {
    finalClasses += ` ${priorityColors[priority] || priorityColors.low}`;
  } else if (className?.includes('overdue')) {
    finalClasses += ` ${statusColors.overdue}`;
  } else if (className?.includes('due')) {
    finalClasses += ` ${statusColors.due}`;
  } else {
    finalClasses += ` ${className || ''}`;
  }

  return (
    <span className={finalClasses} onClick={onClick}>
      {icon && <ApperIcon name={icon} className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;