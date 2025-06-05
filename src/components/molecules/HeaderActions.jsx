import React from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { toast } from 'react-toastify';

const HeaderActions = ({ onAddTask, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onAddTask} className="bg-primary primary">
        <Icon name="Plus" className="w-4 h-4" />
        <span className="hidden sm:inline">Add Task</span>
      </Button>
      
      <Button onClick={onToggleDarkMode} className="icon">
        <Icon name={isDarkMode ? "Sun" : "Moon"} className="w-5 h-5" />
      </Button>
      
      <Button onClick={() => toast.info("Export feature in development")} className="icon">
        <Icon name="Download" className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default HeaderActions;