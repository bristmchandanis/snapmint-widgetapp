import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function SimpleSelect({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select',
  emptyMessage = 'No options available',
  triggerClassName = 'w-full h-9 text-xs sm:text-sm font-medium',
  contentClassName = 'z-[99999] bg-white border border-gray-200 shadow-xl rounded-xl',
  id,
  name,
  disabled,
  error,
}) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          name={name}
          className={`${triggerClassName} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''
            }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-2.5 px-3 text-xs text-gray-500 font-medium text-center">
              {emptyMessage}
            </div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs font-semibold text-rose-500 mt-1 text-left">{error}</p>}
    </div>
  );
}
