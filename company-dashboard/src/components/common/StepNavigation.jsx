import React from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconArrowRight, IconSpinner } from './Icons';

export default function StepNavigation({
  onBack,
  onNext,
  onSubmit,
  nextDisabled = false,
  backDisabled = false,
  nextText = 'Next',
  backText = 'Back',
  saving = false,
  savingText = 'Saving',
  isSubmit = false,
  className = '',
  borderTop = false,
}) {
  const showNextOrSubmit = Boolean(onNext || onSubmit || isSubmit);

  return (
    <div className={`flex items-center justify-between pt-1 ${borderTop ? 'border-t border-gray-100 pt-4' : ''} ${className}`}>
      {onBack ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={backDisabled || saving}
          onClick={onBack}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold px-3 h-8 rounded-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          {backText}
        </Button>
      ) : (
        <div />
      )}

      {showNextOrSubmit && (
        <Button
          type={isSubmit || onSubmit ? 'submit' : 'button'}
          size="sm"
          disabled={nextDisabled || saving}
          onClick={!isSubmit && onNext ? onNext : undefined}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 h-8 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" />
              {savingText}
            </span>
          ) : (
            <>
              {nextText}
              {!isSubmit && !onSubmit && <IconArrowRight className="w-3.5 h-3.5" />}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
