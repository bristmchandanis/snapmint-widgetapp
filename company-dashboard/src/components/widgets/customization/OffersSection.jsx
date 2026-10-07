import React, { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';
import { Input } from '@/components/ui/input';

const RIBBON_FIELDS = [
  { key: 'offerRibbonFill', label: 'Offer ribbon fill' },
  { key: 'offerRibbonText', label: 'Offer ribbon text' },
];

const DEAL_FIELDS = [
  { key: 'dealTagFill', label: 'Deal tag fill' },
  { key: 'dealTagText', label: 'Deal tag text' },
  { key: 'dealTagIcon', label: 'Deal tag icon' },
];

const CHECKBOX_CLASS = 'w-4 h-4 accent-[#151E29] cursor-pointer rounded border-gray-300';

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600">{label}</span>
      <ColorInput className="space-y-0" value={value} onChange={onChange} />
    </div>
  );
}

const OffersSection = memo(function OffersSection({
  isOpen,
  onToggle,
  offers = {},
  setOffers,
}) {
  const update = (key, val) => setOffers((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="p-4 border-t border-gray-100">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-sm text-gray-900">Offers</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </button>
          <input
            type="checkbox"
            checked={Boolean(offers.enabled)}
            onChange={(e) => update('enabled', e.target.checked)}
            className={CHECKBOX_CLASS}
          />
        </div>
      </div>

      {isOpen && offers.enabled && (
        <div className="space-y-3 mt-3">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Appearance</div>

          {/* 1. Offer Ribbon */}
          <div className="border border-gray-100 rounded-md p-2.5 space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer mb-0.5">
              <input
                type="checkbox"
                checked={Boolean(offers.offerRibbon)}
                onChange={(e) => update('offerRibbon', e.target.checked)}
                className={CHECKBOX_CLASS}
              />
              <span className="text-xs font-bold text-gray-900">Offer Ribbon</span>
            </label>

            {offers.offerRibbon &&
              RIBBON_FIELDS.map(({ key, label }) => (
                <ColorRow
                  key={key}
                  label={label}
                  value={offers[key]}
                  onChange={(val) => update(key, val)}
                />
              ))}
          </div>

          {/* 2. Offer Text */}
          <div className="border border-gray-100 rounded-md p-2.5 space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer mb-0.5">
              <input
                type="checkbox"
                checked={Boolean(offers.offerText)}
                onChange={(e) => update('offerText', e.target.checked)}
                className={CHECKBOX_CLASS}
              />
              <span className="text-xs font-bold text-gray-900">Offer text</span>
            </label>

            {offers.offerText && (
              <ColorRow
                label="Offer text colour"
                value={offers.offerTextColour}
                onChange={(val) => update('offerTextColour', val)}
              />
            )}
          </div>

          {/* 3. Limited Time Deal Tag */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-medium">Limited time deal tag</span>
              <input
                type="checkbox"
                checked={Boolean(offers.limitedTimeDealTag)}
                onChange={(e) => update('limitedTimeDealTag', e.target.checked)}
                className={CHECKBOX_CLASS}
              />
            </div>

            {offers.limitedTimeDealTag &&
              DEAL_FIELDS.map(({ key, label }) => (
                <ColorRow
                  key={key}
                  label={label}
                  value={offers[key]}
                  onChange={(val) => update(key, val)}
                />
              ))}
          </div>

          {/* 4. Offer Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-medium">Offer note</span>
              <input
                type="checkbox"
                checked={Boolean(offers.offerNote)}
                onChange={(e) => update('offerNote', e.target.checked)}
                className={CHECKBOX_CLASS}
              />
            </div>

            {offers.offerNote && (
              <div className="space-y-1.5">
                <ColorRow
                  label="Offer note colour"
                  value={offers.offerNoteColour || '#64768B'}
                  onChange={(val) => update('offerNoteColour', val)}
                />
                <div>
                  <label className="block text-[11px] text-gray-600 font-medium mb-1">
                    Offer note text
                  </label>
                  <Input
                    value={offers.offerNoteText || ''}
                    onChange={(e) => update('offerNoteText', e.target.value)}
                    placeholder="Offer will change for order value greater than ₹3000"
                    className="h-8 text-[11px] sm:text-[11px] placeholder:text-[11px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default OffersSection;

