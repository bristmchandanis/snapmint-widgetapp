import React from 'react';
import { Card } from '@/components/ui/card';

export default function Stepper({
  steps = null,
  currentStep = 1,
  totalSteps = null,
  stepLabels = null,
  onStepClick = null,
  className = '',
}) {
  let list = steps;

  if (!list && stepLabels) {
    list = Array.isArray(stepLabels)
      ? stepLabels.map((label, idx) => ({ id: String(idx + 1).padStart(2, '0'), label }))
      : Object.entries(stepLabels).map(([key, label]) => ({ id: String(key).padStart(2, '0'), label }));
  } else if (!list && totalSteps) {
    list = Array.from({ length: totalSteps }, (_, idx) => ({
      id: String(idx + 1).padStart(2, '0'),
      label: `Step ${idx + 1}`,
    }));
  }

  if (!list?.length) return null;

  const currentStepNum = typeof currentStep === 'number'
    ? currentStep
    : (list.findIndex((step) => step.id === currentStep) + 1);
  const activeIdx = Math.max(0, currentStepNum - 1);

  return (
    <Card className={`rounded-2xl border border-gray-200/80 shadow-xs bg-white p-4 sm:p-5 w-full overflow-hidden ${className}`}>
      <div className="overflow-x-auto no-scrollbar w-full">
        <div className="relative flex items-center justify-between min-w-[720px] w-full px-6">
          <div className="absolute top-3.5 left-[38px] right-[38px] h-[1px] bg-gray-200 z-0" />

          {list.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = idx === activeIdx;
            const isDone = idx < activeIdx;
            const isClickable = Boolean(onStepClick && isDone);

            return (
              <button
                key={step.id || idx}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(stepNum)}
                className={`relative z-10 flex flex-col items-center text-center shrink-0 bg-transparent border-0 p-0 ${
                  isClickable ? 'cursor-pointer group' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? 'bg-[#182230] text-white shadow-xs'
                      : isDone
                      ? 'bg-gray-900 text-white group-hover:bg-black group-hover:scale-105'
                      : 'bg-white border border-gray-200 text-gray-400'
                  }`}
                >
                  {step.id || stepNum}
                </div>
                <span
                  className={`text-[11px] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'font-bold text-gray-900'
                      : isDone
                      ? 'font-medium text-gray-700 group-hover:text-black group-hover:font-semibold'
                      : 'font-medium text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
