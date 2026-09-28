import { useState } from 'react';
import { Section, Stack, Grid, TextField, Select, Option, Tabs } from '../../ui';
import StepFooter from './StepFooter';
import { TAB_CONFIGS } from '../../../utils/widgetHelpers';

export default function StepSelectors({
  config,
  onChangeConfig,
  onNext,
  onBack,
  showAllTabs = false,
  heading = 'CSS Selectors (Auto Setup)',
}) {
  const visibleTabs = showAllTabs
    ? TAB_CONFIGS
    : TAB_CONFIGS.filter((tab) => config?.[tab.field] || config?.placements?.includes(tab.code));

  const tabs = visibleTabs.length > 0 ? visibleTabs : [TAB_CONFIGS[0]];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const update = (key, value) => onChangeConfig({ ...config, [key]: value });

  return (
    <Section heading={heading}>
      <Stack gap="base">
        <Tabs
          tabs={tabs}
          selected={currentTab.id}
          onSelect={setActiveTab}
          variant="tertiary"
        />

        <Grid gridTemplateColumns="1fr 1fr" gap="base">
          {currentTab.fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              value={config?.[field.name] || ''}
              onInput={(event) => update(field.name, event?.target?.value ?? event ?? '')}
            />
          ))}

          <Select
            label="Widget Placement Position"
            name={currentTab.placementField}
            value={config?.[currentTab.placementField] || 'after'}
            onChange={(event) => update(currentTab.placementField, typeof event === 'string' ? event : event?.target?.value || 'after')}
          >
            <Option value="after">After</Option>
            <Option value="before">Before</Option>
          </Select>
        </Grid>

        {onNext && onBack && <StepFooter onBack={onBack} onNext={onNext} />}
      </Stack>
    </Section>
  );
}
