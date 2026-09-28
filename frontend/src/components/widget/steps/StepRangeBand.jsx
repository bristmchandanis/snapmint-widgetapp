import { useMemo, useEffect } from 'react';
import { Section, Stack, Grid, TextField, Banner, Text, Checkbox } from '../../ui';
import { Select, OptionGroup, Option } from '../../ui/select';
import { getMerchantPlan } from '../../../utils/widgetHelpers';
import StepFooter from './StepFooter';

const LOCATION_LABELS = {
  PDP: 'PDP (Product Detail)',
  COLLECTION: 'Collection',
  CART: 'Cart Page',
  MINICART: 'Mini Cart',
  CARTDRAWER: 'Cart Drawer',
};

const extractPlacements = (widget) => {
  const meta = widget?.metafield?.value || widget?.config || widget?.style || {};
  const raw = widget?.placements || meta.placements;
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  const flags = [];
  if (widget?.displayPdp || meta.displayPdp) flags.push('PDP');
  if (widget?.displayCollection || meta.displayCollection) flags.push('COLLECTION');
  if (widget?.displayCart || meta.displayCart) flags.push('CART');
  if (widget?.displayMiniCart || meta.displayMiniCart) flags.push('MINICART');
  if (widget?.displayCartDrawer || meta.displayCartDrawer) flags.push('CARTDRAWER');
  if (flags.length > 0) return flags;
  if (widget?.placement || meta.placement) return [widget.placement || meta.placement];
  return ['PDP'];
};

export default function StepRangeBand({ storeDetails, config, onChangeConfig, onNext, onBack, existingWidgets = [], editId }) {
  const merchantPresets = useMemo(() => getMerchantPlan(storeDetails), [storeDetails]);
  const defaultFirstPlan = merchantPresets[0];

  const minAmount = config?.minAmount ?? defaultFirstPlan?.min ?? 0;
  const maxAmount = config?.maxAmount ?? defaultFirstPlan?.max ?? 0;

  const selectedPlan = merchantPresets.find((plan) => plan.min === minAmount && plan.max === maxAmount) || null;
  const isMerchantPlan = selectedPlan != null && !config?.isCustomRange;
  const isReadOnly = isMerchantPlan;

  const planTenure = isMerchantPlan ? selectedPlan?.tenure : config?.tenure;
  const planDpPercent = isMerchantPlan ? selectedPlan?.dpPercent : config?.dpPercent;
  const rawDpType = String(isMerchantPlan ? selectedPlan?.dpType : (config?.dpType ?? '')).toLowerCase();
  const planDpType = rawDpType ? (rawDpType.includes('fix') ? 'fixed' : 'percentage') : '';
  const planEmiPercent = isMerchantPlan ? selectedPlan?.emiPercent : config?.emiPercent;

  // Auto-select first merchant plan if new/unconfigured
  useEffect(() => {
    if (merchantPresets.length > 0 && config?.minAmount == null) {
      const first = merchantPresets[0];
      onChangeConfig({
        ...config,
        minAmount: first.min,
        maxAmount: first.max,
        tenure: first.tenure ?? null,
        dpPercent: first.dpPercent ?? null,
        dpType: first.dpType ?? null,
        emiPercent: first.emiPercent ?? null,
        isCustomRange: false,
      });
    }
  }, [merchantPresets]);

  const selectedValue = useMemo(() => {
    if (config?.isCustomRange) {
      return (maxAmount > minAmount && maxAmount > 0) ? 'custom_active' : 'custom';
    }
    const matched = merchantPresets.find((plan) => plan.min === minAmount && plan.max === maxAmount);
    return matched ? `${matched.min}-${matched.max}` : 'custom';
  }, [config?.isCustomRange, minAmount, maxAmount, merchantPresets]);

  const handleSelectChange = (event) => {
    const value = typeof event === 'string' ? event : (event?.detail?.value ?? event?.target?.value ?? 'custom');
    if (value === 'custom') {
      onChangeConfig({ ...config, minAmount: 0, maxAmount: 0, tenure: null, dpPercent: null, dpType: 'percentage', emiPercent: null, isCustomRange: true, overrideDuplicateRange: false });
    } else if (value === 'custom_active') {
      onChangeConfig({ ...config, isCustomRange: true, overrideDuplicateRange: false });
    } else {
      const [minStr, maxStr] = value.split('-');
      const min = Number(minStr) || 0;
      const max = Number(maxStr) || 0;
      const matched = merchantPresets.find((plan) => plan.min === min && plan.max === max);
      onChangeConfig({
        ...config,
        minAmount: min,
        maxAmount: max,
        tenure: matched?.tenure ?? null,
        dpPercent: matched?.dpPercent ?? null,
        dpType: matched?.dpType ?? null,
        emiPercent: matched?.emiPercent ?? null,
        isCustomRange: false,
        overrideDuplicateRange: false,
      });
    }
  };

  const updateParam = (key, value, isCustom = true) => {
    onChangeConfig({
      ...config,
      [key]: value,
      ...(isCustom ? { isCustomRange: true, overrideDuplicateRange: false } : {}),
    });
  };

  const isInvalidTenure = !isReadOnly && planTenure != null && (planTenure < 1 || planTenure > 60);
  const isInvalidDp = !isReadOnly && planDpPercent != null && planDpType === 'percentage' && (planDpPercent < 0 || planDpPercent > 100);
  const isInvalidEmi = !isReadOnly && planEmiPercent != null && (planEmiPercent < 0 || planEmiPercent > 100);
  const isInvalidRange = !isReadOnly && (minAmount < 0 || (minAmount >= maxAmount && maxAmount > 0));

  const currentPlacements = useMemo(() => extractPlacements(config), [config]);

  // Check for duplicate range and overlapping placements in existing active widgets
  const duplicateWidget = useMemo(() => {
    if (!existingWidgets?.length || Number(maxAmount) <= 0) return null;
    const minVal = Number(minAmount || 0);
    const maxVal = Number(maxAmount || 0);

    for (const widget of existingWidgets) {
      const meta = widget.metafield?.value || widget.config || widget.style || {};
      const isActiveWidget = widget.isActive !== false;
      const widgetMin = Number(widget.minAmount ?? meta.minAmount ?? 0);
      const widgetMax = Number(widget.maxAmount ?? meta.maxAmount ?? 0);

      const isSameRange = widgetMin === minVal && widgetMax === maxVal;
      const isDifferentWidget = editId ? String(widget.id || widget.customizationId) !== String(editId) : true;

      if (isActiveWidget && isSameRange && isDifferentWidget) {
        const widgetPlacements = extractPlacements(widget);
        const overlapping = currentPlacements.filter((placement) => widgetPlacements.includes(placement));
        if (overlapping.length > 0) {
          return {
            widget,
            overlappingPlacements: overlapping,
            overlappingLabels: overlapping.map((placement) => LOCATION_LABELS[placement] || placement).join(', '),
          };
        }
      }
    }
    return null;
  }, [existingWidgets, minAmount, maxAmount, currentPlacements, editId]);

  useEffect(() => {
    if (!duplicateWidget && config?.overrideDuplicateRange) {
      onChangeConfig({ ...config, overrideDuplicateRange: false });
    }
  }, [duplicateWidget]);

  const hasValidationError = isInvalidRange || isInvalidTenure || isInvalidDp || isInvalidEmi;
  const isDuplicateBlocked = Boolean(duplicateWidget && !config?.overrideDuplicateRange);
  const isNextDisabled = minAmount == null || maxAmount == null || minAmount >= maxAmount || (!isMerchantPlan && maxAmount <= 0) || hasValidationError || isDuplicateBlocked;

  return (
    <Section heading="Select Range Band">
      <Stack gap="base">
        <Select label="Range Option" value={selectedValue} onChange={handleSelectChange}>
          {merchantPresets.length > 0 && (
            <OptionGroup label="Merchant Plan Ranges">
              {merchantPresets.map((preset) => (
                <Option key={`${preset.min}-${preset.max}`} value={`${preset.min}-${preset.max}`}>
                  {preset.label}
                </Option>
              ))}
            </OptionGroup>
          )}

          <OptionGroup label="Custom Range">
            {config?.isCustomRange && maxAmount > minAmount && maxAmount > 0 && (
              <Option value="custom_active">
                {`₹${minAmount.toLocaleString('en-IN')} – ₹${maxAmount.toLocaleString('en-IN')}`}
              </Option>
            )}
            <Option value="custom">Custom Value</Option>
          </OptionGroup>
        </Select>

        <Grid gridTemplateColumns="1fr 1fr" gap="base">
          <TextField
            label="Minimum Amount (₹)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={minAmount === 0 && !isMerchantPlan ? '' : String(minAmount)}
            onInput={(event) => updateParam('minAmount', Number(event?.target?.value ?? event) || 0)}
            error={minAmount < 0 ? "Min amount cannot be negative" : undefined}
          />

          <TextField
            label="Maximum Amount (₹)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={maxAmount === 0 && !isMerchantPlan ? '' : String(maxAmount)}
            onInput={(event) => updateParam('maxAmount', Number(event?.target?.value ?? event) || 0)}
            error={isInvalidRange ? "Max amount must be greater than min amount" : undefined}
          />

          <TextField
            label="Tenure (Months)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={planTenure != null ? String(planTenure) : ''}
            onInput={(event) => {
              const value = event?.target?.value ?? event;
              updateParam('tenure', value !== '' ? Number(value) : null);
            }}
            error={isInvalidTenure ? "Tenure must be 1 to 60 months" : undefined}
          />

          <TextField
            label={planDpType === 'fixed' ? 'Down Payment (₹)' : 'Down Payment (%)'}
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={planDpPercent != null ? String(planDpPercent) : ''}
            onInput={(event) => {
              const value = event?.target?.value ?? event;
              updateParam('dpPercent', value !== '' ? Number(value) : null);
            }}
            error={isInvalidDp ? "DP must be 0-100" : undefined}
          />

          {isReadOnly ? (
            <TextField label="DP Type" readOnly={true} value={planDpType === 'fixed' ? 'Fixed' : 'Percentage'} />
          ) : (
            <Select
              label="DP Type"
              value={planDpType || 'percentage'}
              onChange={(event) => updateParam('dpType', (typeof event === 'string' ? event : (event?.detail?.value ?? event?.target?.value)) || 'percentage')}
            >
              <Option value="percentage">Percentage</Option>
              <Option value="fixed">Fixed</Option>
            </Select>
          )}

          <TextField
            label="EMI Rate (%)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={planEmiPercent != null ? String(planEmiPercent) : ''}
            onInput={(event) => {
              const value = event?.target?.value ?? event;
              updateParam('emiPercent', value !== '' ? Number(value) : null);
            }}
            error={isInvalidEmi ? "EMI rate must be 0-100" : undefined}
          />
        </Grid>

        {duplicateWidget && (
          <Banner tone="warning" heading="Existing Widget Conflict for Selected Locations">
            <Stack gap="small">
              <Text>
                This store already has an active widget configured for <strong>{duplicateWidget.overlappingLabels}</strong> in price range{' '}
                <strong>₹{Number(minAmount).toLocaleString('en-IN')} – ₹{Number(maxAmount).toLocaleString('en-IN')}</strong>.
                Replacing it will set the earlier widget to <strong>Inactive</strong> and make this new widget <strong>Active</strong>.
              </Text>
              <Checkbox
                id="overrideDuplicateCheckbox"
                label="Replace existing widget for this price range & locations"
                checked={Boolean(config?.overrideDuplicateRange)}
                onChange={(event) => {
                  const checked = typeof event === 'boolean' ? event : (event?.detail?.checked ?? event?.target?.checked ?? !config?.overrideDuplicateRange);
                  onChangeConfig({ ...config, overrideDuplicateRange: checked });
                }}
              />
            </Stack>
          </Banner>
        )}

        <StepFooter onBack={onBack} onNext={onNext} isNextDisabled={isNextDisabled} />
      </Stack>
    </Section>
  );
}
