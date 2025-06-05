import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';
import SearchInput from '@/components/molecules/SearchInput';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

const TaskList = ({
  filteredTasks,
  categories,
  activeCategory,
  searchQuery,
  setSearchQuery,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
  onCreateTask,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activeCategory === 'all' ? 'All Tasks' : categories.find(c => c.Id === activeCategory)?.Name || 'Tasks'}
        </h2>
        <Button
          onClick={() => toast.info("Productivity insights launching next month")}
          className="text-sm text-primary text-primary"
          icon="BarChart3"
        >
          Analytics
        </Button>
      </div>

      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        className="md:hidden mb-4"
      />

      {filteredTasks.length === 0 ? (
        <EmptyState searchQuery={searchQuery} onCreateTask={onCreateTask} />
) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id || `task-${index}`}
                task={task}
                categories={categories}
                onToggle={onTaskToggle}
                onDelete={onTaskDelete}
                onEdit={onTaskEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;