import React from 'react';
import AutoSetupTabSelectors from '../AutoSetupTabSelectors';
import StepNavigation from '../../common/StepNavigation';

export default function StepSelectors({ config, onChangeConfig, onNext, onBack, disabled = false }) {
  return (
    <div className="w-full space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Enter Selectors</h3>
      </div>

      <AutoSetupTabSelectors
        config={config}
        onChangeConfig={(updated) => !disabled && onChangeConfig(updated)}
        disabled={disabled}
      />

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}
