import React, { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const CASHBACK_FIELDS = [
  { key: 'ribbonFill', label: 'Ribbon fill', defaultVal: '#F1F5F9' },
  { key: 'ribbonText', label: 'Ribbon text', defaultVal: '#151E29' },
];

const CashbackColorField = memo(function CashbackColorField({ fieldKey, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-700 font-medium">{label}</span>
      <ColorInput
        value={value}
        onChange={(val) => onChange(fieldKey, val?.toUpperCase())}
      />
    </div>
  );
});

const CashbackSection = memo(function CashbackSection({
  isOpen,
  onToggle,
  cashback = {},
  setCashback,
}) {
  const handleColorChange = useCallback((key, val) => {
    setCashback((prev) => ({ ...prev, [key]: val }));
  }, [setCashback]);

  const isEnabled = Boolean(cashback.enabled);

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">Cashback</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setCashback((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 accent-[#151E29] cursor-pointer rounded border-gray-300"
            />
          </label>
        </div>
      </div>

      {isOpen && isEnabled && (
        <div className="space-y-3 mt-3">
          {CASHBACK_FIELDS.map(({ key, label, defaultVal }) => (
            <CashbackColorField
              key={key}
              fieldKey={key}
              label={label}
              value={cashback[key] || defaultVal}
              onChange={handleColorChange}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default CashbackSection;
