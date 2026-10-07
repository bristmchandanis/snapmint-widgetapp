import { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export default function ColorInput({ name, label, value, onChange, onRemove, autoOpen, className = '' }) {
  const colorVal = value || '#FFFFFF';
  const pickerRef = useRef(null);

  useEffect(() => {
    if (autoOpen && pickerRef.current) {
      requestAnimationFrame(() => pickerRef.current?.click());
    }
  }, [autoOpen]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <Label className="text-xs font-semibold text-gray-700 block">{label}</Label>}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1.5 pr-3 bg-white shadow-2xs hover:border-gray-400 transition-all">
          <label className="relative w-6 h-6 rounded-md overflow-hidden cursor-pointer border border-black/10 shrink-0 shadow-2xs">
            <span className="block w-full h-full" style={{ backgroundColor: colorVal }} />
            <input
              ref={pickerRef}
              type="color"
              value={colorVal}
              onChange={(e) => onChange?.(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
          <Input
            type="text"
            name={name}
            value={value || ''}
            maxLength={7}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-16 h-6 px-0 text-xs font-mono font-semibold text-gray-800 uppercase border-0 shadow-none focus-visible:ring-0 bg-transparent"
            placeholder="#FFFFFF"
          />
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer shrink-0"
            title="Remove colour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
