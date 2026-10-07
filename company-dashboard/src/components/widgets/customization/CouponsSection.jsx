import React, { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const STRIP_FIELDS = [
  { key: 'couponStripFill', label: 'Coupon strip fill', d: '#FDF2F7' },
  { key: 'couponStripText', label: 'Coupon strip text', d: '#151E29' },
  { key: 'couponIconColour', label: 'Coupon icon colour', d: '#BE185D' },
];

const LIST_FIELDS = [
  { key: 'listButtonColour', label: 'List button colour', d: '#FF6F00' },
  { key: 'listButtonTextColour', label: 'List button text colour', d: '#FFFFFF' },
  { key: 'listNavIcons', label: 'List nav icons', d: '#64768B' },
];

const PAGE_FIELDS = [
  { key: 'couponPageBackground', label: 'Coupon page background', d: '#FFFFFF' },
  { key: 'headingTotalText', label: 'Heading & total text', d: '#151E29' },
  { key: 'summaryCouponCodeText', label: 'Summary & coupon code text', d: '#334255' },
  { key: 'couponCodeFieldFill', label: 'Coupon code field fill', d: '#FFFFFF' },
  { key: 'fieldCouponDetailsText', label: 'Field & coupon details text', d: '#334255' },
  { key: 'fieldCardBorder', label: 'Field & card border', d: '#CBD5E1' },
  { key: 'couponCardFill', label: 'Coupon card fill', d: '#FFFFFF' },
  { key: 'couponIconColour', label: 'Coupon % icon colour', d: '#BE185D' },
  { key: 'applyColour', label: 'Apply colour', d: '#FF6F00' },
  { key: 'applyButtonText', label: 'Apply button text', d: '#FFFFFF' },
  { key: 'listNavIcons', label: 'Navigation & information icons', d: '#0E4381' },
];

const DEFAULT_PAGE_COLOURS = Object.fromEntries(PAGE_FIELDS.map((f) => [f.key, f.d]));

const CouponsSection = memo(function CouponsSection({
  isCouponPageMode = false,
  isOpen = true,
  onToggle,
  coupons = {},
  setCoupons,
  onPreviewList,
}) {
  const update = useCallback(
    (k, v) => {
      const val = v?.toUpperCase();
      setCoupons((p) => {
        const next = { ...p, [k]: val };
        if (k === 'applyColour') next.listButtonColour = val;
        if (k === 'applyButtonText') next.listButtonTextColour = val;
        if (k === 'listButtonColour') next.applyColour = val;
        if (k === 'listButtonTextColour') next.applyButtonText = val;
        return next;
      });
    },
    [setCoupons]
  );

  const render = (fields) =>
    fields.map(({ key, label, d }) => (
      <div key={key} className="flex items-center justify-between text-xs">
        <span className="text-gray-700 font-medium">{label}</span>
        <ColorInput
          className="space-y-0"
          value={coupons[key] || (key === 'applyColour' ? coupons.listButtonColour : key === 'applyButtonText' ? coupons.listButtonTextColour : d)}
          onChange={(val) => update(key, val)}
        />
      </div>
    ));

  return (
    <div className={`p-4 border-t border-gray-100 ${isCouponPageMode ? 'flex-1 overflow-y-auto' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={onToggle} className="flex items-center gap-1.5 font-bold text-xs text-gray-900 cursor-pointer">
          <span>{isCouponPageMode ? 'Coupon page colours' : 'Coupons'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </button>
        {isCouponPageMode ? (
          <button type="button" onClick={() => setCoupons((p) => ({ ...p, ...DEFAULT_PAGE_COLOURS }))} className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer">
            Reset colours
          </button>
        ) : (
          <input type="checkbox" checked disabled readOnly className="w-4 h-4 accent-[#151E29] opacity-90 rounded border-gray-300 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <div className="space-y-1.5 mt-2">
          {isCouponPageMode ? (
            <>
              {render(PAGE_FIELDS)}
              {(coupons.applyColour || coupons.listButtonColour || '#FF6F00').toUpperCase() === '#FF6F00' &&
                (coupons.applyButtonText || coupons.listButtonTextColour || '#FFFFFF').toUpperCase() === '#FFFFFF' && (
                  <div className="bg-[#FFF9EB] border border-[#FEEFD0] rounded-md p-3 text-xs text-[#8A5416] leading-relaxed mt-2">
                    Readability check: coupon button text has low contrast. Try a lighter background or darker text.
                  </div>
                )}
            </>
          ) : (
            <>
              <p className="text-[11px] text-gray-400">Available on Express pop-ups. Coupon content is managed on the configuration page.</p>
              {render(STRIP_FIELDS)}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-900">Coupon list page</span>
                <button type="button" onClick={onPreviewList} className="text-xs text-gray-600 hover:text-gray-900 underline font-medium cursor-pointer">
                  Preview list
                </button>
              </div>
              {render(LIST_FIELDS)}
              <p className="text-[11px] text-gray-400 italic">Sample coupons are for appearance preview only.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default CouponsSection;
