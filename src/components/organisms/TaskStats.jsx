import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const TaskStats = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        icon="Clock"
        iconBgClass="bg-blue-100 dark:bg-blue-900"
        iconColorClass="text-blue-600 dark:text-blue-400"
        label="Total Tasks"
        value={tasks.length}
      />
      
      <StatCard
        icon="CheckCircle"
        iconBgClass="bg-green-100 dark:bg-green-900"
        iconColorClass="text-green-600 dark:text-green-400"
        label="Completed"
        value={completedTasks}
      />
      
      <StatCard
        icon="AlertCircle"
        iconBgClass="bg-red-100 dark:bg-red-900"
        iconColorClass="text-red-600 dark:text-red-400"
        label="Overdue"
        value={overdueTasks}
      />
    </div>
  );
};

export default TaskStats;