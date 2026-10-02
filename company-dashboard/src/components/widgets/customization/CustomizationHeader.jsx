import React from 'react';
import { Label } from '@/components/ui/label';
import SimpleSelect from '@/components/common/SimpleSelect';

export const PLACEMENT_TABS = [
  { id: 'pdp', label: 'PDP' },
  { id: 'mini-cart', label: 'Mini cart' },
  { id: 'cart', label: 'Cart' },
  { id: 'checkout', label: 'Checkout' },
];

export default function CustomizationHeader({
  activePlacement,
  setActivePlacement,
  isPlacementEnabled,
  selectedPlanPreviewMode,
  setSelectedPlanPreviewMode,
  hasMultiPlan,
  selectedFutureRepayments,
  setSelectedFutureRepayments,
  availableFutureRepayments = [],
  activePopupStyle,
  setActivePopupStyle,
  applicableStyles = [],
}) {
  const dropdowns = [
    {
      label: 'Plan preview',
      value: selectedPlanPreviewMode,
      onChange: setSelectedPlanPreviewMode,
      minWidth: 'min-w-[125px]',
      options: [
        { value: 'single', label: 'Single Plan' },
        ...(hasMultiPlan ? [{ value: 'multi', label: 'Multi Plan' }] : []),
      ],
    },
    {
      label: 'Future repayments',
      value: selectedFutureRepayments,
      onChange: setSelectedFutureRepayments,
      minWidth: 'min-w-[115px]',
      options: availableFutureRepayments,
    },
    {
      label: 'Plan style',
      value: activePopupStyle,
      onChange: setActivePopupStyle,
      disabled: selectedPlanPreviewMode === 'multi',
      minWidth: 'min-w-[100px]',
      options: applicableStyles.map((s) => ({ value: s.id, label: s.label })),
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-md">
        {PLACEMENT_TABS.map((tab) => {
          const isEnabled = isPlacementEnabled(tab.id);
          const isActive = activePlacement === tab.id;

          if (!isEnabled) {
            return (
              <button
                key={tab.id}
                type="button"
                disabled
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-gray-300 cursor-not-allowed select-none bg-transparent"
              >
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePlacement(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {dropdowns.map(({ label, value, onChange, options, disabled, minWidth }) => (
          <div key={label} className="flex flex-col gap-1">
            <Label className="text-[10px] font-normal text-slate-600 leading-none">{label}</Label>
            <SimpleSelect
              value={value}
              onValueChange={onChange}
              options={options}
              disabled={disabled}
              triggerClassName={`h-8 text-xs font-medium text-gray-800 bg-white border-gray-200 rounded-md px-2.5 py-1 shadow-2xs hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${minWidth || 'min-w-[115px]'}`}
              contentClassName="z-[99999] bg-white border border-gray-200 shadow-xl rounded-md min-w-[var(--radix-select-trigger-width)] p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
