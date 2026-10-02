import React from 'react';
import { X } from 'lucide-react';
import { ELEMENT_MAP } from '../shared/constants.jsx';

function ColorPopover({ label, color, onChange, onClose }) {
  return (
    <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-white rounded-md shadow-xl border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-600 uppercase">{label}</span>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        type="color"
        value={color || '#000000'}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-full h-12 rounded-md cursor-pointer border border-gray-200 p-0.5 bg-white mb-2"
      />

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-400 font-medium">HEX</span>
        <input
          type="text"
          value={color || ''}
          maxLength={7}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="flex-1 px-2 py-1 border border-gray-200 rounded-md text-[10px] font-mono font-semibold text-gray-800 uppercase focus:outline-none focus:border-gray-400"
        />
      </div>
    </div>
  );
}

export default function ElementInspector({
  selectedElement,
  onClose,
  editorTab,
  setEditorTab,
  elementOverrides = {},
  setElementOverrides,
  activePickerField,
  setActivePickerField,
  handleElementColorChange,
  colors = {},
  offers = {},
  rbi = {},
  cashback = {},
  coupons = {},
}) {
  const elDef = selectedElement && ELEMENT_MAP[selectedElement];
  if (!elDef) return null;

  const overrides = elementOverrides[selectedElement] || {};
  const hasOverrides = Object.keys(overrides).length > 0;

  // Resolves the active base color across categories
  const getBaseColor = (key) => {
    if (offers[key] !== undefined || key === 'offerNoteColour') return offers[key] || offers.dealTagFill;
    if (key === 'rbiIcons') return rbi?.iconsColour || '#FF6F00';
    if (key === 'rbiText') return rbi?.textColour || '#64768B';
    if (key === 'ribbonFill') return cashback?.ribbonFill || '#D1F4FC';
    if (key === 'ribbonText') return cashback?.ribbonText || '#151E29';
    if (key === 'couponStripFill') return coupons?.couponStripFill || '#FDF2F7';
    if (key === 'couponStripText') return coupons?.couponStripText || '#151E29';
    if (key === 'couponIconColour') return coupons?.couponIconColour || '#BE185D';
    return colors[key] || '#000000';
  };

  const handleResetOverride = () => {
    setElementOverrides((prev) => {
      const next = { ...prev };
      delete next[selectedElement];
      return next;
    });
  };

  return (
    <div className="p-4 border-b border-[#ebdff7] bg-[#fcfaff]">
      {/* 1. Header: Element Title & Done Action */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900">{elDef.label}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-[#513487] font-medium cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* 2. Scope Selector: This element vs Shared style */}
      <div className="flex items-center p-0.5 bg-[#f0ebf7] rounded-md border border-[#e5dced] mb-2">
        <button
          type="button"
          onClick={() => setEditorTab('this')}
          className={`flex-1 text-[11px] font-semibold py-1 rounded-md cursor-pointer transition-all ${editorTab === 'this' ? 'bg-white text-[#513487] shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          This element
        </button>
        <button
          type="button"
          onClick={() => setEditorTab('shared')}
          className={`flex-1 text-[11px] font-semibold py-1 rounded-md cursor-pointer transition-all ${editorTab === 'shared' ? 'bg-white text-[#513487] shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          Shared style
        </button>
      </div>

      {/* 3. Scope Helper Text & Reset Override Button */}
      <div className="flex items-center justify-between mb-3 text-[11px]">
        <span className="text-gray-500 italic">
          {editorTab === 'this'
            ? 'Only the selected element will change.'
            : 'Changes will apply to all elements sharing this style.'}
        </span>
        {editorTab === 'this' && hasOverrides && (
          <button
            type="button"
            onClick={handleResetOverride}
            className="text-[10px] text-[#513487] hover:text-red-600 font-semibold cursor-pointer underline shrink-0 ml-2"
          >
            Reset override
          </button>
        )}
      </div>

      {/* 4. Interactive Color Swatches */}
      <div className="flex flex-wrap gap-2">
        {elDef.fields.map(({ key, label }) => {
          const color = editorTab === 'this' ? (overrides[key] || getBaseColor(key)) : getBaseColor(key);
          const isOpen = activePickerField === `el-${key}`;

          return (
            <div key={key} className="relative">
              <button
                type="button"
                onClick={() => setActivePickerField(isOpen ? null : `el-${key}`)}
                className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 bg-white text-[10.5px] font-medium cursor-pointer transition-all ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-400'
                  }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: color || '#000000' }}
                />
                <span className="text-gray-700">{label}</span>
              </button>

              {isOpen && (
                <ColorPopover
                  label={label}
                  color={color}
                  onChange={(val) => handleElementColorChange(key, val)}
                  onClose={() => setActivePickerField(null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


