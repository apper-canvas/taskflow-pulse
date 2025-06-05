import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const ToggleButton = ({ isChecked, onToggle, taskId }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(taskId);
      }}
      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors focus-ring"
    >
      {isChecked && (
        <ApperIcon name="Check" className="w-3 h-3 text-primary animate-check" />
      )}
    </button>
  );
};

export default ToggleButton;