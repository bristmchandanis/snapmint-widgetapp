import React from 'react';
import InlineLayoutSelector from '../InlineLayoutSelector';
import PopupLayoutSelector from '../PopupLayoutSelector';
import StepNavigation from '../../common/StepNavigation';

export default function StepMasterWidget({
  selectedInlineLayout,
  onSelectInlineLayout,
  selectedPopupLayout,
  onSelectPopupLayout,
  onNext,
  onBack,
  disabled = false,
}) {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* 1. INLINE BANNER SECTION */}
      <div>
        <InlineLayoutSelector
          selectedLayoutId={selectedInlineLayout}
          onSelectLayout={(id) => !disabled && onSelectInlineLayout && onSelectInlineLayout(id)}
          disabled={disabled}
          hideTitle={false}
        />
      </div>

      {/* 2. POPUP LAYOUT SECTION (5 Image Cards) */}
      <div className="pt-2">
        <PopupLayoutSelector
          selectedLayoutId={selectedPopupLayout}
          onSelectLayout={(id) => !disabled && onSelectPopupLayout && onSelectPopupLayout(id)}
          disabled={disabled}
        />
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        borderTop
      />
    </div>
  );
}
