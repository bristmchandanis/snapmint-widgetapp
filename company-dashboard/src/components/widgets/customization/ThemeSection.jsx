import React, { memo } from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

const THEMES = [
  {
    id: 'orange',
    label: 'Orange',
    dark: false,
    barColor: 'bg-orange-500',
    dotsBorder: 'border-gray-200',
    dotsBg: '',
    containerBg: 'bg-gray-50 border-gray-100',
    checkColor: 'text-orange-600',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    dark: false,
    barColor: 'bg-gray-800',
    dotsBorder: 'border-gray-200',
    dotsBg: '',
    containerBg: 'bg-gray-50 border-gray-100',
    checkColor: 'text-orange-600',
  },
  {
    id: 'darkMode',
    label: 'Dark Mode',
    dark: true,
    barColor: 'bg-orange-500',
    dotsBorder: 'border-gray-700',
    dotsBg: 'bg-gray-800',
    containerBg: 'bg-gray-950 border-gray-800',
    checkColor: 'text-orange-400',
  },
];

const ThemeSection = memo(function ThemeSection({
  isOpen,
  onToggle,
  selectedTheme = 'orange',
  onSelectTheme,
}) {
  return (
    <div className="p-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between font-bold text-xs text-gray-900 mb-3 cursor-pointer"
      >
        <span>Pick a theme</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-2 rounded-md border text-center cursor-pointer transition-all ${
                  isSelected
                    ? `border-orange-500 ${theme.dark ? 'bg-gray-900 text-white' : 'bg-white'}`
                    : `border-gray-200 ${theme.dark ? 'bg-gray-900 text-white' : 'bg-white'}`
                }`}
              >
                <div className={`h-10 rounded-md border flex flex-col items-center justify-center p-1 mb-1.5 ${theme.containerBg}`}>
                  <div className={`w-6 h-1 rounded-full mb-1 ${theme.barColor}`} />
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-xs border ${theme.dotsBorder} ${theme.dotsBg}`} />
                    <div className={`w-2 h-2 rounded-xs border ${theme.dotsBorder} ${theme.dotsBg}`} />
                    <div className={`w-2 h-2 rounded-xs border ${theme.dotsBorder} ${theme.dotsBg}`} />
                  </div>
                  <div className={`w-8 h-1 rounded-full mt-1 ${theme.barColor}`} />
                </div>
                <div className={`flex items-center justify-center gap-1 text-[11px] font-semibold ${theme.dark ? 'text-gray-200' : 'text-gray-800'}`}>
                  <span>{theme.label}</span>
                  {isSelected && <Check className={`w-3 h-3 ${theme.checkColor}`} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default ThemeSection;
