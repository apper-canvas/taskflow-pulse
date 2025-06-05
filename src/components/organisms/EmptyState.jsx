import React from 'react';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ searchQuery, onCreateTask }) => {
  return (
    <div className="text-center py-12">
      <Icon name="CheckSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {searchQuery ? 'No tasks found' : 'No tasks yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
      </p>
      {!searchQuery && (
        <Button onClick={onCreateTask} className="bg-primary primary">
          Create Task
        </Button>
      )}
    </div>
  );
};

export default EmptyState;