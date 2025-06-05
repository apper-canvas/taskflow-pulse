import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import RadioButton from '@/components/atoms/RadioButton';

const FormField = ({ label, type = 'text', value, onChange, placeholder, error, options, name, rows, priorityOptions, statusOptions, disabled = false }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return <Textarea value={value} onChange={handleChange} placeholder={placeholder} rows={rows} />;
      case 'select':
        return <Select value={value} onChange={handleChange} options={options} />;
      case 'radio-priority':
        return (
          <div className="space-y-2">
            {priorityOptions.map(option => (
              <RadioButton
                key={option.value}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                label={option.label}
                colorClass={option.color}
                bgClass={option.bg}
              />
            ))}
          </div>
        );
      case 'radio-status':
        return (
          <div className="space-y-2">
            {statusOptions.map(option => (
              <RadioButton
                key={option.value}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                label={option.label}
                icon={option.icon}
              />
            ))}
          </div>
        );
      default:
        return <Input type={type} value={value} onChange={handleChange} placeholder={placeholder} error={error} disabled={disabled}/>;
    }
  };

  return (
    <div>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FormField;