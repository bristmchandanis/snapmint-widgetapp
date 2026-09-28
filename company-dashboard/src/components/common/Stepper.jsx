import React from 'react';

export default function Stepper({
  currentStep = 1,
  totalSteps,
  stepLabels = null,
  className = '',
}) {
  const isArray = Array.isArray(stepLabels);

  const derivedTotalSteps =
    totalSteps ||
    (isArray
      ? stepLabels.length
      : stepLabels
        ? Object.keys(stepLabels).length
        : 1);

  const stepLabel =
    (isArray ? stepLabels[currentStep - 1] : stepLabels?.[currentStep]) ||
    `Step ${currentStep}`;

  const progressPercent = Math.min(100, Math.max(0, (currentStep / derivedTotalSteps) * 100));

  return (
    <div className={`w-full space-y-2 mb-6 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Step {currentStep} of {derivedTotalSteps}</span>
        <span>{stepLabel}</span>
      </div>

      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

