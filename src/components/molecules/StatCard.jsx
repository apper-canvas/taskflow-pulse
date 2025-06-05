import React from 'react';
import Icon from '@/components/atoms/Icon';

const StatCard = ({ icon, iconBgClass, iconColorClass, label, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6">
      <div className="flex items-center">
        <div className={`${iconBgClass} rounded-lg p-3 mr-4`}>
          <Icon name={icon} className={`w-6 h-6 ${iconColorClass}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;