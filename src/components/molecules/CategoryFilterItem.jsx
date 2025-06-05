import React from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

const CategoryFilterItem = ({ category, isActive, onClick, taskCount }) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center">
        <Icon name={category.icon || "Folder"} className="w-4 h-4 mr-2" />
        {category.name}
      </span>
      <span className="text-xs">{taskCount}</span>
    </Button>
  );
};

export default CategoryFilterItem;