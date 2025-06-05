import React from 'react';
import CategoryFilterItem from '@/components/molecules/CategoryFilterItem';
import Icon from '@/components/atoms/Icon';

const CategorySidebar = ({ categories, activeCategory, setActiveCategory, tasks, getCategoryTaskCount }) => {
  return (
    <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 h-fit sticky top-24">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
          <nav className="space-y-1">
            <CategoryFilterItem
              category={{ name: 'All Tasks', icon: 'List' }}
              isActive={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              taskCount={tasks.length}
            />
            
            {categories.map(category => (
              <CategoryFilterItem
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                taskCount={getCategoryTaskCount(category.id)}
              />
            ))}
          </nav>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Templates</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Task templates coming soon</p>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;