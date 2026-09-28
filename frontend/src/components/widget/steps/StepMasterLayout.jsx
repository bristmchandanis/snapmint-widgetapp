import React from 'react';
import { Section, Stack } from '../../ui';
import MasterTemplateGallery from '../MasterTemplateGallery';
import StepFooter from './StepFooter';

export default function StepMasterLayout({
  masterTemplateId,
  onSelectTemplate,
  onNext,
  onBack,
}) {
  return (
    <Section heading="Master Layout">
      <Stack gap="base">
        <MasterTemplateGallery
          selectedTemplateId={masterTemplateId}
          onSelectTemplate={onSelectTemplate}
        />

        <StepFooter
          onBack={onBack}
          onNext={onNext}
          isNextDisabled={!masterTemplateId}
        />
      </Stack>
    </Section>
  );
}
