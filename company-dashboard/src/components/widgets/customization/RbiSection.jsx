import React, { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const RBI_FIELDS = [
  { key: 'iconsColour', label: 'RBI icons colour' },
  { key: 'textColour', label: 'RBI text colour' },
];

const RbiSection = memo(function RbiSection({
  isOpen,
  onToggle,
  rbi = {},
  setRbi,
}) {
  const updateRbiColor = useCallback(
    (key, val) => setRbi((prev) => ({ ...prev, [key]: val?.toUpperCase() })),
    [setRbi]
  );

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">RBI regulated &amp; trusted users</span>
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
              checked={Boolean(rbi.enabled)}
              onChange={(e) => setRbi((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 accent-[#151E29] cursor-pointer rounded border-gray-300"
            />
          </label>
        </div>
      </div>

      {isOpen && rbi.enabled && (
        <div className="space-y-3 mt-3">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Show the trust row from your pop-up design.
          </p>

          {RBI_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-medium">{label}</span>
              <ColorInput
                value={rbi[key]}
                onChange={(val) => updateRbiColor(key, val)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default RbiSection;
