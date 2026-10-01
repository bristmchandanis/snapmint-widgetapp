import React, { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const STRIP_FIELDS = [
  { key: 'couponStripFill', label: 'Coupon strip fill', defaultValue: '#FDF2F7' },
  { key: 'couponStripText', label: 'Coupon strip text', defaultValue: '#151E29' },
  { key: 'couponIconColour', label: 'Coupon icon colour', defaultValue: '#BE185D' },
];

const LIST_FIELDS = [
  { key: 'listButtonColour', label: 'List button colour', defaultValue: '#FF6F00' },
  { key: 'listButtonTextColour', label: 'List button text colour', defaultValue: '#FFFFFF' },
  { key: 'listNavIcons', label: 'List nav icons', defaultValue: '#64768B' },
];

const CouponsSection = memo(function CouponsSection({
  isOpen,
  onToggle,
  coupons = {},
  setCoupons,
  onPreviewList,
}) {
  const updateCouponColor = useCallback(
    (key, val) => setCoupons((prev) => ({ ...prev, [key]: val?.toUpperCase() })),
    [setCoupons]
  );

  const renderFields = (fields) =>
    fields.map(({ key, label, defaultValue }) => (
      <div key={key} className="flex items-center justify-between text-xs">
        <span className="text-gray-700 font-medium">{label}</span>
        <ColorInput
          value={coupons[key] || defaultValue}
          onChange={(val) => updateCouponColor(key, val)}
        />
      </div>
    ));

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">Coupons</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <label className="relative inline-flex items-center cursor-default">
            <input
              type="checkbox"
              checked
              disabled
              readOnly
              className="w-4 h-4 accent-[#151E29] opacity-90 cursor-not-allowed rounded border-gray-300 pointer-events-none"
            />
          </label>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 mt-3">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Available on Express pop-ups. Coupon content is managed on the configuration page.
          </p>

          {renderFields(STRIP_FIELDS)}

          {/* Coupon list page sub-header with Preview list */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-gray-900">Coupon list page</span>
            <button
              type="button"
              onClick={onPreviewList}
              className="text-xs text-gray-600 hover:text-gray-900 underline font-medium cursor-pointer"
            >
              Preview list
            </button>
          </div>

          {renderFields(LIST_FIELDS)}

          <p className="text-[11px] text-gray-400 italic">Sample coupons are for appearance preview only.</p>
        </div>
      )}
    </div>
  );
});

export default CouponsSection;

