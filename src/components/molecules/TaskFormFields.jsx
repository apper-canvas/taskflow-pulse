import React from 'react';
import FormField from '@/components/molecules/FormField';
import Icon from '@/components/atoms/Icon';

const TaskFormFields = ({ formData, handleInputChange, errors, categories, isEditing }) => {
  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-amber-600', bg: 'bg-amber-100' },
    { value: 'low', label: 'Low Priority', color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: 'Circle' },
    { value: 'in-progress', label: 'In Progress', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const categoryOptions = [{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c.id, label: c.name }))];

  return (
    <>
      <FormField
        label="Task Title *"
        value={formData.title}
        onChange={(val) => handleInputChange('title', val)}
        placeholder="Enter task title..."
        error={errors.title}
      />

      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(val) => handleInputChange('description', val)}
        placeholder="Add task description..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Priority"
          type="radio-priority"
          name="priority"
          value={formData.priority}
          onChange={(val) => handleInputChange('priority', val)}
          priorityOptions={priorityOptions}
        />

        {isEditing && (
          <FormField
            label="Status"
            type="radio-status"
            name="status"
            value={formData.status}
            onChange={(val) => handleInputChange('status', val)}
            statusOptions={statusOptions}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(val) => handleInputChange('dueDate', val)}
          error={errors.dueDate}
        />

        <FormField
          label="Category"
          type="select"
          value={formData.categoryId}
          onChange={(val) => handleInputChange('categoryId', val)}
          options={categoryOptions}
        />
      </div>

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={(val) => handleInputChange('notes', val)}
        placeholder="Add additional notes..."
        rows={2}
      />

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon name="Repeat" className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recurring Task
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Coming in v2.0</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Set up recurring tasks - Feature coming soon
        </p>
      </div>
    </>
  );
};

export default TaskFormFields;