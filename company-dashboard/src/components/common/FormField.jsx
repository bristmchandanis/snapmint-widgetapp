import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconEye, IconEyeOff } from './Icons';

export default function FormField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  icon: Icon,
  onChange,
  onBlur,
  autoComplete,
  disabled,
  readOnly,
  required = false,
  action,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  return (
    <div className="space-y-1 text-left">
      {label && (
        <Label htmlFor={id} className="text-xs font-semibold text-gray-700 block">
          {typeof label === 'string' ? label.replace(/\s*\*+$/, '') : label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      <div className={action ? 'flex items-center gap-2' : ''}>
        <div className="relative flex items-center flex-1">
          {Icon && <Icon className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />}
          <Input
            id={id}
            name={name}
            type={isPasswordType && showPassword ? 'text' : type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            readOnly={readOnly}
            className={`${Icon ? 'pl-10' : 'pl-3.5'} ${type === 'textarea' ? 'min-h-[75px] py-2' : 'h-9'} text-xs sm:text-sm font-medium bg-white border-gray-200 text-gray-900 focus:border-gray-400 transition-all ${
              isPasswordType ? 'pr-10' : ''
            } ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''} ${disabled || readOnly ? 'disabled:opacity-100 disabled:bg-white disabled:text-gray-900 readOnly:opacity-100 readOnly:bg-white readOnly:text-gray-900 cursor-default' : ''} ${className}`}
            value={value != null ? value : ''}
            onChange={onChange}
            onBlur={onBlur}
          />
          {isPasswordType && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
            </Button>
          )}
        </div>
        {action}
      </div>
      {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
