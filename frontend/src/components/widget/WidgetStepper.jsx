import { Section, Box, ProgressBar } from '../ui';

const STEP_LABELS = {
  1: 'Locations',
  2: 'Range band',
  3: 'Master layout',
  4: 'Selectors',
  5: 'Customization',
  6: 'Save',
};

const TOTAL_STEPS = 6;

export default function WidgetStepper({ currentStep = 1 }) {
  const stepLabel = STEP_LABELS[currentStep] || 'Locations';
  const progressPercent = Math.min(100, Math.max(0, (currentStep / TOTAL_STEPS) * 100));

  return (
    <Section>
      <Box padding="small">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#202223' }}>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
            {stepLabel}
          </span>
        </div>
        <ProgressBar progress={progressPercent} tone="success" size="small" />
      </Box>
    </Section>
  );
}
