import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import AppHeader from '@/components/organisms/AppHeader';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskStats from '@/components/organisms/TaskStats';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import Icon from '@/components/atoms/Icon';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksResult || []);
        setCategories(categoriesResult || []);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === 'all' || task.categoryId === activeCategory;
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      const updatedTask = await taskService.update(taskId, { ...task, status: newStatus });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (newStatus === 'completed') {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as todo");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted successfully");
      setShowTaskDetail(null);
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddTask={() => setShowCreateModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            tasks={tasks}
            getCategoryTaskCount={getCategoryTaskCount}
          />

          <main className="flex-1">
            <TaskStats tasks={tasks} />
            <TaskList
              filteredTasks={filteredTasks}
              categories={categories}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onTaskToggle={handleTaskToggle}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={setShowTaskDetail}
              onCreateTask={() => setShowCreateModal(true)}
            />
          </main>
        </div>
      </div>

      <TaskModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showTaskDetail={showTaskDetail}
        setShowTaskDetail={setShowTaskDetail}
        tasks={tasks}
        setTasks={setTasks}
        categories={categories}
      />
    </div>
  );
};

export default HomePage;