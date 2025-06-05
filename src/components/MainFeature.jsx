import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import { taskService, categoryService } from '../services'

export default function MainFeature({ 
  showCreateModal, 
  setShowCreateModal, 
  showTaskDetail, 
  setShowTaskDetail,
  tasks,
  setTasks,
  categories,
  setCategories
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    status: 'todo',
    notes: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Initialize form data when editing
  useEffect(() => {
    if (showTaskDetail) {
      setFormData({
        title: showTaskDetail.title || '',
        description: showTaskDetail.description || '',
        priority: showTaskDetail.priority || 'medium',
        dueDate: showTaskDetail.dueDate ? format(new Date(showTaskDetail.dueDate), 'yyyy-MM-dd') : '',
        categoryId: showTaskDetail.categoryId || '',
        status: showTaskDetail.status || 'todo',
        notes: showTaskDetail.notes || ''
      })
      setIsEditing(true)
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        status: 'todo',
        notes: ''
      })
      setIsEditing(false)
    }
    setErrors({})
  }, [showTaskDetail])

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    setLoading(true)
    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        notes: formData.notes.trim(),
        dueDate: formData.dueDate || null,
        updatedAt: new Date().toISOString()
      }

      if (isEditing && showTaskDetail) {
        const updatedTask = await taskService.update(showTaskDetail.id, {
          ...showTaskDetail,
          ...taskData
        })
        setTasks(prev => prev.map(t => t.id === showTaskDetail.id ? updatedTask : t))
        toast.success('Task updated successfully!')
        setShowTaskDetail(null)
      } else {
        const newTask = await taskService.create({
          ...taskData,
          createdAt: new Date().toISOString()
        })
        setTasks(prev => [...prev, newTask])
        toast.success('Task created successfully!')
        setShowCreateModal(false)
      }

      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        status: 'todo',
        notes: ''
      })
    } catch (err) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Close modal
  const closeModal = () => {
    if (isEditing) {
      setShowTaskDetail(null)
    } else {
      setShowCreateModal(false)
    }
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      categoryId: '',
      status: 'todo',
      notes: ''
    })
    setErrors({})
  }

  // Priority options
  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-amber-600', bg: 'bg-amber-100' },
    { value: 'low', label: 'Low Priority', color: 'text-gray-600', bg: 'bg-gray-100' }
  ]

  // Status options
  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: 'Circle' },
    { value: 'in-progress', label: 'In Progress', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ]

  const isModalOpen = showCreateModal || showTaskDetail

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform glass-morphism rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add task description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Priority and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <div className="space-y-2">
                      {priorityOptions.map(option => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={formData.priority === option.value}
                            onChange={(e) => handleInputChange('priority', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`flex items-center w-full p-3 rounded-lg border-2 transition-all ${
                            formData.priority === option.value
                              ? 'border-primary bg-primary bg-opacity-5'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}>
                            <div className={`w-3 h-3 rounded-full mr-3 ${option.bg}`}></div>
                            <span className={`font-medium ${option.color} dark:text-gray-300`}>
                              {option.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status (only show when editing) */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <div className="space-y-2">
                        {statusOptions.map(option => (
                          <label key={option.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value={option.value}
                              checked={formData.status === option.value}
                              onChange={(e) => handleInputChange('status', e.target.value)}
                              className="sr-only"
                            />
                            <div className={`flex items-center w-full p-3 rounded-lg border-2 transition-all ${
                              formData.status === option.value
                                ? 'border-primary bg-primary bg-opacity-5'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}>
                              <ApperIcon name={option.icon} className="w-4 h-4 mr-3 text-gray-500" />
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {option.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Due Date and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                        errors.dueDate ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add additional notes..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Recurring Tasks Placeholder */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="Repeat" className="w-5 h-5 text-gray-400 mr-2" />
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

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <ApperIcon name={isEditing ? "Save" : "Plus"} className="w-4 h-4" />
                        {isEditing ? 'Update Task' : 'Create Task'}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 sm:flex-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}