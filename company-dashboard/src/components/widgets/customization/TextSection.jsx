import React, { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FormField from '@/components/common/FormField';

const TEXT_FIELDS = [
  {
    key: 'topTitle',
    label: 'Top title',
    placeholder: 'Pay only',
  },
  {
    key: 'amountTitle',
    label: 'Amount title',
    placeholder: '{amount} Now',
    hint: "Keep '{amount}' for the calculated payment amount · 17 characters maximum.",
  },
  {
    key: 'sizeSheetTitle',
    label: 'Size sheet title',
    placeholder: 'Choose Size for {merchant} EMI Purchase',
    hint: "Keep '{merchant}' for the saved merchant name · up to 34 other characters, all on one line.",
  },
];

const TextSection = memo(function TextSection({
  isOpen,
  onToggle,
  customText = {},
  setCustomText,
  onResetText,
}) {
  const handleChange = (key, value) => {
    setCustomText((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">Change Text</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onResetText}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Reset text
          </button>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
        Express pop-up wording. Fonts and colours stay as configured.
      </p>

      {isOpen && (
        <div className="space-y-3">
          {TEXT_FIELDS.map(({ key, label, placeholder, hint }) => (
            <FormField
              key={key}
              id={key}
              name={key}
              label={label}
              placeholder={placeholder}
              value={customText[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              hint={hint}
              className="h-9 text-xs sm:text-xs"
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default TextSection;
