import React, { memo } from 'react';
import { ChevronUp, ChevronDown, Play } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';
import { ExpressBottomTabSelector } from '../shared/ExpressBottomSection';

export const COLOR_FIELDS = {
  colours: [
    { key: 'brandAccent', label: 'Brand accent' },
    { key: 'payNowTagFill', label: 'Pay now tag fill' },
    { key: 'payNowTagText', label: 'Pay now tag text' },
    { key: 'mainText', label: 'Main text' },
    { key: 'popupBg', label: 'Pop-up background' },
  ],
  expressBottomSize: [
    { key: 'bottomBg', label: 'Bottom background' },
    { key: 'bottomText', label: 'Bottom text colour' },
    { key: 'fieldBg', label: 'Field background' },
    { key: 'fieldPlaceholder', label: 'Field placeholder' },
    { key: 'fieldBorder', label: 'Field border' },
    { key: 'buttonFill', label: 'Button fill' },
    { key: 'buttonText', label: 'Button text' },
  ],
  expressBottomName: [
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

function ColorFieldList({ fields, colors, onApplyColor }) {
  return (
    <div className="space-y-2.5">
      {fields.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between text-xs">
          <span className="text-gray-700 font-medium">{label}</span>
          <ColorInput
            value={colors[key]}
            onChange={(val) => onApplyColor(key, val)}
          />
        </div>
      ))}
    </div>
  );
}

const ColoursSection = memo(function ColoursSection({
  coloursOpen,
  onToggleColours,
  expressBottomOpen,
  onToggleExpressBottom,
  moreColoursOpen,
  onToggleMoreColours,
  colors = {},
  onApplyPaletteColor,
  onResetColors,
  isExpressPlacement = true,
  expressTab = 'size',
  onExpressTabChange,
}) {
  return (
    <div className="p-4 border-t border-gray-100">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onToggleColours}
          className="flex items-center gap-1.5 font-bold text-sm text-gray-900 cursor-pointer"
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
        <div className="space-y-4">
          {/* Primary Colours */}
          <ColorFieldList
            fields={COLOR_FIELDS.colours}
            colors={colors}
            onApplyColor={onApplyPaletteColor}
          />

          {/* Express bottom section (when applicable) */}
          {isExpressPlacement && (
            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onToggleExpressBottom}
                className="w-full flex items-center justify-between font-bold text-sm text-gray-900 cursor-pointer mb-2.5"
              >
                <span>Express bottom section</span>
                {expressBottomOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
              </button>

              {expressBottomOpen && (
                <div>
                  <ExpressBottomTabSelector
                    activeTab={expressTab}
                    onTabChange={onExpressTabChange}
                  />
                  <ColorFieldList
                    fields={expressTab === 'size' ? COLOR_FIELDS.expressBottomSize : COLOR_FIELDS.expressBottomName}
                    colors={colors}
                    onApplyColor={onApplyPaletteColor}
                  />
                </div>
              )}
            </div>
          )}

          {/* More colour controls - Boxed button matching user screenshot */}
          <div className="pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onToggleMoreColours}
              className="w-full flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg py-2.5 px-3.5 text-sm font-bold text-gray-900 transition-colors cursor-pointer text-left shadow-2xs"
            >
              <Play
                className={`w-2.5 h-2.5 fill-gray-900 text-gray-900 transition-transform duration-150 ${
                  moreColoursOpen ? 'rotate-90' : 'rotate-0'
                }`}
              />
              <span>More colour controls</span>
            </button>

            {moreColoursOpen && (
              <div className="pt-3">
                <ColorFieldList
                  fields={COLOR_FIELDS.moreColours}
                  colors={colors}
                  onApplyColor={onApplyPaletteColor}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ColoursSection;
