import React, { useState, useRef, useEffect, memo } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export const COLOR_FIELDS = {
  colours: [
    { key: 'brandAccent', label: 'Brand accent' },
    { key: 'payNowTagFill', label: 'Pay now tag fill' },
    { key: 'payNowTagText', label: 'Pay now tag text' },
    { key: 'mainText', label: 'Main text' },
    { key: 'popupBg', label: 'Pop-up background' },
  ],
  expressBottom: [
    { key: 'bottomBg', label: 'Bottom background' },
    { key: 'bottomText', label: 'Bottom text colour' },
    { key: 'fieldBg', label: 'Field background' },
    { key: 'enteredText', label: 'Entered text' },
    { key: 'fieldPlaceholder', label: 'Field placeholder' },
    { key: 'fieldBorder', label: 'Field border' },
    { key: 'buttonFill', label: 'Button fill' },
    { key: 'buttonText', label: 'Button text' },
  ],
  moreColours: [
    { key: 'secondaryText', label: 'Secondary text' },
    { key: 'planBg', label: 'Plan background' },
    { key: 'uspText', label: 'USP text' },
    { key: 'paymentCards', label: 'Payment cards' },
    { key: 'selectedCard', label: 'Selected card' },
    { key: 'selectedOutline', label: 'Selected outline' },
  ],
};

const ColorPickerPopover = memo(function ColorPickerPopover({
  label,
  currentColor,
  brandColors = [],
  logoColors = [],
  onSelectColor,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('brand');
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-in fade-in zoom-in-95 duration-150"
      style={{ minWidth: '280px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-xs text-gray-900">{label}</h4>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-md mb-3 text-center text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'brand'
            ? 'bg-white text-gray-900 shadow-2xs border border-orange-500/60'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Brand colours
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'custom'
            ? 'bg-white text-gray-900 shadow-2xs border border-orange-500/60'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Custom
        </button>
      </div>

      {activeTab === 'brand' ? (
        <div className="space-y-3">
          {brandColors.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-500 mb-2">Brand colours</div>
              <div className="grid grid-cols-6 gap-2">
                {brandColors.map((color, idx) => {
                  const isSelected = String(color).toUpperCase() === String(currentColor).toUpperCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectColor(color)}
                      className={`w-9 h-9 rounded-md border cursor-pointer transition-transform hover:scale-105 shadow-2xs relative ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1 border-orange-500' : 'border-black/10'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {logoColors.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-500 mb-2">From your logo</div>
              <div className="grid grid-cols-6 gap-2">
                {logoColors.map((color, idx) => {
                  const isSelected = String(color).toUpperCase() === String(currentColor).toUpperCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectColor(color)}
                      className={`w-9 h-9 rounded-md border cursor-pointer transition-transform hover:scale-105 shadow-2xs relative ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1 border-orange-500' : 'border-black/10'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2.5">
            <p className="text-[11px] text-gray-400 leading-tight">
              Applies to every element using this shared colour.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Pick colour</label>
          <input
            type="color"
            value={currentColor || '#000000'}
            onChange={(e) => onSelectColor(e.target.value.toUpperCase())}
            className="w-full h-20 rounded-md cursor-pointer border border-gray-200 p-1 bg-white shadow-2xs"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">HEX</span>
            <input
              type="text"
              value={currentColor || ''}
              maxLength={7}
              onChange={(e) => onSelectColor(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-mono font-semibold text-gray-800 uppercase focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
});

const ColorInput = memo(function ColorInput({
  fieldKey,
  label,
  value,
  onChange,
  onApplyPaletteColor,
  activePickerField,
  setActivePickerField,
  brandColors,
  logoColors,
}) {
  const isPickerOpen = activePickerField === fieldKey;

  return (
    <div className="relative">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-700 font-medium">{label}</span>
        <button
          type="button"
          onClick={() => setActivePickerField(isPickerOpen ? null : fieldKey)}
          className={`flex items-center gap-2 border rounded-md p-1 pr-2.5 bg-white shadow-2xs cursor-pointer hover:border-gray-400 transition-all ${isPickerOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200'
            }`}
        >
          <div
            className="w-6 h-6 rounded-md border border-black/10 shrink-0 shadow-2xs"
            style={{ backgroundColor: value || '#000000' }}
          />
          <span className="w-16 text-xs font-mono font-semibold text-gray-800 uppercase text-left">
            {value || '#000000'}
          </span>
        </button>
      </div>

      {isPickerOpen && (
        <ColorPickerPopover
          label={label}
          currentColor={value}
          brandColors={brandColors}
          logoColors={logoColors}
          onSelectColor={(val) => {
            onApplyPaletteColor(fieldKey, val);
          }}
          onClose={() => setActivePickerField(null)}
        />
      )}
    </div>
  );
});

const ColorFieldsList = memo(function ColorFieldsList({
  fields,
  colors,
  onColorChange,
  onApplyPaletteColor,
  activePickerField,
  setActivePickerField,
  brandColors,
  logoColors,
}) {
  return (
    <div className="space-y-2.5">
      {fields.map(({ key, label }) => (
        <ColorInput
          key={key}
          fieldKey={key}
          label={label}
          value={colors[key]}
          onChange={(val) => onColorChange(key, val)}
          onApplyPaletteColor={onApplyPaletteColor}
          activePickerField={activePickerField}
          setActivePickerField={setActivePickerField}
          brandColors={brandColors}
          logoColors={logoColors}
        />
      ))}
    </div>
  );
});

const ColoursSection = memo(function ColoursSection({
  coloursOpen,
  onToggleColours,
  expressBottomOpen,
  onToggleExpressBottom,
  moreColoursOpen,
  onToggleMoreColours,
  colors = {},
  onColorChange,
  onApplyPaletteColor,
  onResetColors,
  activePickerField,
  setActivePickerField,
  brandColors = [],
  logoColors = [],
  isExpressPlacement = true,
}) {
  const commonProps = {
    colors,
    onColorChange,
    onApplyPaletteColor,
    activePickerField,
    setActivePickerField,
    brandColors,
    logoColors,
  };

  return (
    <>
      {/* 1. Change colours Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onToggleColours}
            className="flex items-center gap-1.5 font-bold text-xs text-gray-900 cursor-pointer"
          >
            <span>Change colours</span>
            {coloursOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </button>
          <button
            type="button"
            onClick={onResetColors}
            className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            Reset colours
          </button>
        </div>

        {coloursOpen && (
          <ColorFieldsList fields={COLOR_FIELDS.colours} {...commonProps} />
        )}
      </div>

      {/* 2. Express bottom section - only when placement has express popup type */}
      {isExpressPlacement && (
        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onToggleExpressBottom}
            className="w-full flex items-center justify-between font-bold text-xs text-gray-900 cursor-pointer mb-3"
          >
            <span>Express bottom section</span>
            {expressBottomOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {expressBottomOpen && (
            <div className="space-y-2.5">
              <ColorFieldsList fields={COLOR_FIELDS.expressBottom} {...commonProps} />
            </div>
          )}
        </div>
      )}

      {/* 3. More colour controls */}
      <div className="p-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onToggleMoreColours}
          className="w-full flex items-center justify-between font-bold text-xs text-gray-900 cursor-pointer mb-3"
        >
          <div className="flex items-center gap-1.5">
            {moreColoursOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <span className="text-[10px] text-gray-500">▶</span>}
            <span>More colour controls</span>
          </div>
        </button>

        {moreColoursOpen && (
          <ColorFieldsList fields={COLOR_FIELDS.moreColours} {...commonProps} />
        )}
      </div>
    </>
  );
});

export default ColoursSection;

