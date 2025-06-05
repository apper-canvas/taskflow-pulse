import React from 'react';

const RadioButton = ({ name, value, checked, onChange, label, colorClass, bgClass }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`flex items-center w-full p-3 rounded-lg border-2 transition-all ${
        checked
          ? 'border-primary bg-primary bg-opacity-5'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}>
        {bgClass && <div className={`w-3 h-3 rounded-full mr-3 ${bgClass}`}></div>}
        <span className={`font-medium ${colorClass} dark:text-gray-300`}>
          {label}
        </span>
      </div>
    </label>
  );
};

export default RadioButton;