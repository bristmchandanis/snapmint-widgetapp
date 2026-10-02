import React, { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const POPUP_RADII = ['0 px', '4 px', '8 px', '12 px', '16 px', '20 px', '24 px', '28 px', '32 px'];
const BUTTON_RADII = ['0 px', '2 px', '4 px', '6 px', '8 px', '10 px', '12 px', '16 px', '32 px'];

const RADIUS_FIELDS = [
  { key: 'popup', label: 'Pop-up corner radius', defaultVal: '16 px', options: POPUP_RADII },
  { key: 'container', label: 'EMIs + total order value · outer container', defaultVal: '16 px', options: POPUP_RADII },
  { key: 'button', label: 'Button corner radius', defaultVal: '6 px', options: BUTTON_RADII },
];

const CornerRadiusSection = memo(function CornerRadiusSection({
  isOpen,
  onToggle,
  cornerRadii = {},
  setCornerRadii,
}) {
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">Corner radius</span>
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
        Adjust each corner radius independently.
      </p>

      {isOpen && (
        <div className="space-y-3">
          {RADIUS_FIELDS.map(({ key, label, defaultVal, options }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
              <div className="relative">
                <select
                  value={cornerRadii[key] || defaultVal}
                  onChange={(e) => setCornerRadii((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full h-9 px-3 pr-8 border border-gray-200 rounded-md text-xs bg-white text-gray-800 appearance-none focus:outline-none focus:border-gray-400 cursor-pointer shadow-2xs"
                >
                  {options.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default CornerRadiusSection;
