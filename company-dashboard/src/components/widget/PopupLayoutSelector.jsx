import React from 'react';
import defaultPopupImg from '../../assets/images/popup/Default.png';
import zeroOneDpPopupImg from '../../assets/images/popup/0_1dp.png';
import nineteenDpPopupImg from '../../assets/images/popup/19dp.png';
import payLaterPopupImg from '../../assets/images/popup/payLater.png';
import multiPlanPopupImg from '../../assets/images/popup/multiPlan.png';

export const POPUP_LAYOUT_CARDS = [
  { id: 'default', title: 'Default', image: defaultPopupImg },
  { id: '0/1-Dp', title: '0/1-Dp', image: zeroOneDpPopupImg },
  { id: '19Dp', title: '19Dp', image: nineteenDpPopupImg },
  { id: 'payLater', title: 'Pay Later', image: payLaterPopupImg },
  { id: 'mulPlan', title: 'Multiple Plan', image: multiPlanPopupImg },
];

export default function PopupLayoutSelector({
  selectedLayoutId = 'default',
  onSelectLayout,
  disabled = false,
  hideTitle = false,
}) {
  return (
    <div className="space-y-4 text-left w-full">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Select Popup Layout</h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
        {POPUP_LAYOUT_CARDS.map(({ id, title, image }) => {
          const isSelected = selectedLayoutId === id;

          return (
            <div
              key={id}
              onClick={() => {
                if (!disabled && onSelectLayout) {
                  onSelectLayout(id);
                }
              }}
              className={`relative rounded-xl border p-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between select-none w-full bg-white ${isSelected
                ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-sm'
                : 'border-slate-200 hover:border-gray-400'
                }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-10 w-5.5 h-5.5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md pointer-events-none">
                  <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="w-full p-1.5 flex items-center justify-center flex-1 min-h-[300px]">
                <img
                  src={image}
                  alt={title}
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                  className="w-auto max-w-full h-auto max-h-[350px] object-contain block pointer-events-none rounded-lg mx-auto transition-transform"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
