import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { taskService } from '@/services';
import ModalHeader from '@/components/molecules/ModalHeader';
import TaskFormFields from '@/components/molecules/TaskFormFields';
import DetailModalFooter from '@/components/molecules/DetailModalFooter';

const TaskModal = ({ 
  showCreateModal, 
  setShowCreateModal, 
  showTaskDetail, 
  setShowTaskDetail,
  tasks,
  setTasks,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    status: 'todo',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      });
      setIsEditing(true);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        status: 'todo',
        notes: ''
      });
      setIsEditing(false);
    }
    setErrors({});
  }, [showTaskDetail]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        notes: formData.notes.trim(),
        dueDate: formData.dueDate || null,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && showTaskDetail) {
        const updatedTask = await taskService.update(showTaskDetail.id, {
          ...showTaskDetail,
          ...taskData
        });
        setTasks(prev => prev.map(t => t.id === showTaskDetail.id ? updatedTask : t));
        toast.success('Task updated successfully!');
        setShowTaskDetail(null);
      } else {
        const newTask = await taskService.create({
          ...taskData,
          createdAt: new Date().toISOString()
        });
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully!');
        setShowCreateModal(false);
      }

      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        status: 'todo',
        notes: ''
      });
    } catch (err) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const closeModal = () => {
    if (isEditing) {
      setShowTaskDetail(null);
    } else {
      setShowCreateModal(false);
    }
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      categoryId: '',
      status: 'todo',
      notes: ''
    });
    setErrors({});
  };

  const isModalOpen = showCreateModal || showTaskDetail;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform glass-morphism rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader title={isEditing ? 'Edit Task' : 'Create New Task'} onClose={closeModal} />

              <form onSubmit={handleSubmit} className="space-y-6">
                <TaskFormFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  categories={categories}
                  isEditing={isEditing}
                />
                <DetailModalFooter isEditing={isEditing} loading={loading} onClose={closeModal} />
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;