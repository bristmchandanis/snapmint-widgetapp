import React, { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const ColorField = memo(function ColorField({ fieldKey, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600">{label}</span>
      <ColorInput
        value={value}
        onChange={(val) => onChange(fieldKey, val?.toUpperCase())}
      />
    </div>
  );
});

const RIBBON_FIELDS = [
  { key: 'offerRibbonFill', label: 'Offer ribbon fill' },
  { key: 'offerRibbonText', label: 'Offer ribbon text' },
];

const DEAL_FIELDS = [
  { key: 'dealTagFill', label: 'Deal tag fill' },
  { key: 'dealTagText', label: 'Deal tag text' },
  { key: 'dealTagIcon', label: 'Deal tag icon' },
];

const OffersSection = memo(function OffersSection({
  isOpen,
  onToggle,
  offers = {},
  setOffers,
}) {
  const updateColor = useCallback((key, val) => {
    setOffers((prev) => ({ ...prev, [key]: val }));
  }, [setOffers]);

  const toggle = useCallback((key) => (e) => {
    setOffers((prev) => ({ ...prev, [key]: e.target.checked }));
  }, [setOffers]);

  const checkboxClass = "w-4 h-4 accent-[#151E29] cursor-pointer rounded border-gray-300";

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-xs text-gray-900">Offers</span>
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
              checked={Boolean(offers.enabled)}
              onChange={toggle('enabled')}
              className={checkboxClass}
            />
          </label>
        </div>
      </div>

      {isOpen && offers.enabled && (
        <div className="space-y-4 mt-3">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Appearance</div>

          {/* Offer Ribbon */}
          <div className="border border-gray-100 rounded-lg p-3 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={Boolean(offers.offerRibbon)}
                onChange={toggle('offerRibbon')}
                className={checkboxClass}
              />
              <span className="text-xs font-bold text-gray-900">Offer Ribbon</span>
            </div>

            {offers.offerRibbon && (
              RIBBON_FIELDS.map(({ key, label }) => (
                <ColorField
                  key={key}
                  fieldKey={key}
                  label={label}
                  value={offers[key]}
                  onChange={updateColor}
                />
              ))
            )}
          </div>

          {/* Offer Text */}
          <div className="border border-gray-100 rounded-lg p-3 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={Boolean(offers.offerText)}
                onChange={toggle('offerText')}
                className={checkboxClass}
              />
              <span className="text-xs font-bold text-gray-900">Offer text</span>
            </div>

            {offers.offerText && (
              <ColorField
                fieldKey="offerTextColour"
                label="Offer text colour"
                value={offers.offerTextColour}
                onChange={updateColor}
              />
            )}
          </div>

          {/* Limited time deal tag */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-medium">Limited time deal tag</span>
              <input
                type="checkbox"
                checked={Boolean(offers.limitedTimeDealTag)}
                onChange={toggle('limitedTimeDealTag')}
                className={checkboxClass}
              />
            </div>

            {offers.limitedTimeDealTag && (
              <div className="space-y-2.5 pl-0">
                {DEAL_FIELDS.map(({ key, label }) => (
                  <ColorField
                    key={key}
                    fieldKey={key}
                    label={label}
                    value={offers[key]}
                    onChange={updateColor}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Offer note */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-medium">Offer note</span>
              <input
                type="checkbox"
                checked={Boolean(offers.offerNote)}
                onChange={toggle('offerNote')}
                className={checkboxClass}
              />
            </div>

            {offers.offerNote && (
              <div className="space-y-2.5">
                <ColorField
                  fieldKey="offerNoteColour"
                  label="Offer note colour"
                  value={offers.offerNoteColour || '#64768B'}
                  onChange={updateColor}
                />

                <div>
                  <label className="block text-xs text-gray-700 font-medium mb-1.5">
                    Offer note text
                  </label>
                  <input
                    type="text"
                    value={offers.offerNoteText || ''}
                    onChange={(e) => setOffers((prev) => ({ ...prev, offerNoteText: e.target.value }))}
                    placeholder="Offer will change for order value greater than ₹3000"
                    className="w-full h-9 px-3 border border-gray-200 rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:border-gray-400 shadow-2xs"
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
