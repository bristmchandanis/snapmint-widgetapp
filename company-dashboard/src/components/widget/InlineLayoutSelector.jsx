import React from 'react';
import singleRowButtonImg from '../../assets/images/SingleRow Button.png';
import singleRowLinkImg from '../../assets/images/SingleRowLink.png';
import minimalPillImg from '../../assets/images/MinimalPill.png';
import twoRowButtonImg from '../../assets/images/TwoRowButton.png';
import { DEFAULT_INLINE_CONFIG } from '../../utils/moduleData';

const INLINE_LAYOUT_CARDS = [
  { id: 'singleRowButton', title: 'Single Row Button', image: singleRowButtonImg },
  { id: 'singleRowLink', title: 'Single Row Link', image: singleRowLinkImg },
  { id: 'minimalPill', title: 'Minimal Pill', image: minimalPillImg },
  { id: 'twoRowButton', title: 'Two Row Button', image: twoRowButtonImg },
];

export default function InlineLayoutSelector({
  selectedLayoutId,
  onSelectLayout,
  disabled = false,
  hideTitle = false,
}) {
  const currentSelected = selectedLayoutId || DEFAULT_INLINE_CONFIG.layoutType;

  return (
    <div className="space-y-4 text-left w-full">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Select Inline Banner</h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {INLINE_LAYOUT_CARDS.map(({ id, title, image }) => {
          const isSelected = Boolean(currentSelected) && (currentSelected === id || currentSelected.startsWith(id));

          return (
            <div
              key={id}
              onClick={() => {
                if (!disabled && onSelectLayout) {
                  onSelectLayout(id);
                }
              }}
              className={`relative rounded-xl border p-2.5 sm:p-3 transition-all duration-200 cursor-pointer flex items-center justify-center select-none w-full h-[88px] bg-white ${
                isSelected
                  ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-sm'
                  : 'border-slate-200 hover:border-gray-400'
                }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xs pointer-events-none">
                  <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <img
                src={image}
                alt={title}
                className="w-auto h-auto max-w-full pointer-events-none block"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
