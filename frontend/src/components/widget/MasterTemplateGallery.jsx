import React from 'react';
import { Grid, Clickable, Box } from '../ui';
import TemplatePreview from './TemplatePreviews';

export const MASTER_TEMPLATES = [
  { id: 'master_1' },
  { id: 'master_2' },
];

export default function MasterTemplateGallery({ selectedTemplateId, onSelectTemplate }) {
  return (
    <Grid gridTemplateColumns="repeat(auto-fit, minmax(320px, 1fr))" gap="large">
      {MASTER_TEMPLATES.map((tmpl) => {
        const isSelected = selectedTemplateId === tmpl.id;
        return (
          <Clickable
            key={tmpl.id}
            onClick={() => onSelectTemplate(tmpl.id)}
            padding="none"
            border="none"
          >
            <Box style={{ pointerEvents: 'none', width: '100%' }}>
              <TemplatePreview
                templateId={tmpl.id}
                sampleAmount={3000}
                viewMode="desktop"
                isSelected={isSelected}
              />
            </Box>
          </Clickable>
        );
      })}
    </Grid>
  );
}
