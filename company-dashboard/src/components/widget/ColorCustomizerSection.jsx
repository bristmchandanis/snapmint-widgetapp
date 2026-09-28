import React from 'react';
import ColorInput from '../common/ColorInput';
import { Card, CardContent } from '@/components/ui/card';
import { IconChevronDown, IconChevronUp } from '../common/Icons';

export default function ColorCustomizerSection({
  title,
  previewLabel = 'Live Preview',
  preview,
  fieldsConfig = [],
  colors = {},
  defaultColors = {},
  disabled = false,
  onChangeColor,
  isOpen = true,
  onToggle,
}) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden w-full">
      <div
        onClick={onToggle}
        className="p-4 bg-[#f8fafc] hover:bg-slate-100/90 flex flex-row items-center justify-between cursor-pointer select-none transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-900 text-left">{title}</h3>
        <div className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {isOpen ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-5 bg-white border-t border-gray-200 animate-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fieldsConfig.map(({ key, label }) => (
                  <div key={key} className="[&>div]:space-y-1 [&_label]:block text-left">
                    <ColorInput
                      name={key}
                      label={label}
                      value={colors[key] || defaultColors[key]}
                      disabled={disabled}
                      onChange={(val) => onChangeColor && onChangeColor(key, val)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {preview && (
              <div className="lg:col-span-5 lg:sticky lg:top-6">
                <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-[#f8fafc] border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 text-left">{previewLabel}</h3>
                  </div>
                  <CardContent className="p-1 sm:p-2 bg-gray-50/50">
                    {preview}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
