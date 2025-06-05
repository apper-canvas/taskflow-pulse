import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import SearchInput from '@/components/molecules/SearchInput';
import HeaderActions from '@/components/molecules/HeaderActions';
import { toast } from 'react-toastify';

const AppHeader = ({ searchQuery, setSearchQuery, onAddTask, isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="bg-primary rounded-lg p-2 mr-3">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow Pro</h1>
          </div>

          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onFocus={() => toast.info("Advanced filtering coming soon!")}
            className="flex-1 max-w-md mx-8 hidden md:block"
          />

          <HeaderActions
            onAddTask={onAddTask}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;