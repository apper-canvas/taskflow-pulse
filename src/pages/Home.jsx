import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService, categoryService } from '../services'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTaskDetail, setShowTaskDetail] = useState(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ])
        setTasks(tasksResult || [])
        setCategories(categoriesResult || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Filter tasks based on category and search
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === 'all' || task.categoryId === activeCategory
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get category task counts
  const getCategoryTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId).length
  }

  // Handle task status toggle
  const handleTaskToggle = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      const updatedTask = await taskService.update(taskId, { ...task, status: newStatus })
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      
      if (newStatus === 'completed') {
        toast.success("Task completed! 🎉")
      } else {
        toast.info("Task marked as todo")
      }
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  // Handle task deletion
  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success("Task deleted successfully")
      setShowTaskDetail(null)
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[priority] || colors.low}`}>
        {priority || 'low'}
      </span>
    )
  }

  // Task card component
  const TaskCard = ({ task }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-lg transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 group cursor-pointer"
        onClick={() => setShowTaskDetail(task)}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTaskToggle(task.id)
            }}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors focus-ring"
          >
            {task.status === 'completed' && (
              <ApperIcon name="Check" className="w-3 h-3 text-primary animate-check" />
            )}
          </button>
          
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
              <PriorityBadge priority={task.priority} />
              
              {task.dueDate && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isOverdue 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              
              {task.categoryId && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {categories.find(c => c.id === task.categoryId)?.name || 'Unknown'}
                </span>
              )}
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowTaskDetail(task)
              }}
              className="p-1 text-gray-400 hover:text-primary transition-colors"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleTaskDelete(task.id)
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-2 mr-3">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow Pro</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => toast.info("Advanced filtering coming soon!")}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ApperIcon name={isDarkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => toast.info("Export feature in development")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ApperIcon name="Download" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 h-fit sticky top-24">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <ApperIcon name="List" className="w-4 h-4 mr-2" />
                      All Tasks
                    </span>
                    <span className="text-xs">{tasks.length}</span>
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <ApperIcon name={category.icon || "Folder"} className="w-4 h-4 mr-2" />
                        {category.name}
                      </span>
                      <span className="text-xs">{getCategoryTaskCount(category.id)}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Templates</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Task templates coming soon</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 mr-4">
                    <ApperIcon name="Clock" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mr-4">
                    <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tasks.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 dark:bg-red-900 rounded-lg p-3 mr-4">
                    <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeCategory === 'all' ? 'All Tasks' : categories.find(c => c.id === activeCategory)?.name || 'Tasks'}
                </h2>
                <button
                  onClick={() => toast.info("Productivity insights launching next month")}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  <ApperIcon name="BarChart3" className="w-4 h-4 inline mr-1" />
                  Analytics
                </button>
              </div>

              {/* Mobile Search */}
              <div className="md:hidden mb-4">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'No tasks found' : 'No tasks yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <MainFeature
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showTaskDetail={showTaskDetail}
        setShowTaskDetail={setShowTaskDetail}
        tasks={tasks}
        setTasks={setTasks}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  )
}