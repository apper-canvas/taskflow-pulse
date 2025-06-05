import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/atoms/Icon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, categories, onToggle, onDelete, onEdit }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const categoryName = categories.find(c => c.id === task.categoryId)?.name || 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-lg transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 group cursor-pointer"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="toggle-check"
        >
          {task.status === 'completed' && (
            <Icon name="Check" className="w-3 h-3 text-primary animate-check" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 dark:text-white mb-1 ${
            task.status === 'completed' ? 'line-through text-gray-500' : ''
          }`}>
            {task.title || 'Untitled Task'}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          
<div className="flex items-center gap-2 flex-wrap">
            <Badge priority={task.priority} />
            {task.dueDate && (
              <Badge 
                icon="Calendar"
                className={isOverdue ? 'overdue' : 'due'}
              >
                {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            )}
            
            {task.categoryId && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {categoryName}
              </span>
            )}
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="link"
            icon="Edit"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="delete"
            icon="Trash2"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;