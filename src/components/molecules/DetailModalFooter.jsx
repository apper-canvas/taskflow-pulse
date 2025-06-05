import React from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

const DetailModalFooter = ({ isEditing, loading, onClose }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button
        type="submit"
        disabled={loading}
        className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        icon={loading ? null : (isEditing ? "Save" : "Plus")}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          isEditing ? 'Update Task' : 'Create Task'
        )}
      </Button>
      
      <Button
        type="button"
        onClick={onClose}
        className="flex-1 sm:flex-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium transition-colors"
      >
        Cancel
      </Button>
    </div>
  );
};

export default DetailModalFooter;