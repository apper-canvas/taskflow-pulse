import React from 'react';
import Icon from '@/components/atoms/Icon';
import Input from '@/components/atoms/Input';

const SearchInput = ({ searchQuery, setSearchQuery, onFocus, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={onFocus}
        className="w-full pl-10 pr-4 py-2"
      />
    </div>
  );
};

export default SearchInput;