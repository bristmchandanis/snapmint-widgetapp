import React from 'react';
import Stepper from '../common/Stepper';

const WIDGET_STEP_LABELS = {
  1: 'Store',
  2: 'Locations',
  3: 'Range band',
  4: 'Master layout',
  5: 'Selectors',
  6: 'Customization',
};

export default function WidgetStepper({
  currentStep = 1,
  totalSteps = 6,
  stepLabels = WIDGET_STEP_LABELS,
  ...props
}) {
  return (
    <Stepper
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      {...props}
    />
  );
}


