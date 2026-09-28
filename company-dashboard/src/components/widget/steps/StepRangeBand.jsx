import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { IconChevronDown, IconAlertTriangle, IconSliders } from '@/components/common/Icons';
import FormField from '../../common/FormField';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { parseMerchantPlans, getRangeBandDisplayLabel } from '@/utils/helpers';
import { extractPlacements } from '@/utils/widgetHelpers';
import StepNavigation from '../../common/StepNavigation';

const LOCATION_LABELS = {
  PDP: 'PDP (Product Detail)',
  COLLECTION: 'Collection',
  CART: 'Cart Page',
  MINICART: 'Mini Cart',
  CARTDRAWER: 'Cart Drawer',
};

const extractPlanParams = (merchantPresets = [], config = {}) => {
  const defaultFirstPlan = merchantPresets[0];
  const minAmount = config?.minAmount != null ? config.minAmount : (defaultFirstPlan?.min || 0);
  const maxAmount = config?.maxAmount != null ? config.maxAmount : (defaultFirstPlan?.max || 0);
  const selectedPlan = merchantPresets.find((plan) => plan.min === minAmount && plan.max === maxAmount) || null;
  const isMerchantPlan = Boolean(selectedPlan) && !config?.isCustomRange;

  const tenure = isMerchantPlan && selectedPlan?.tenure ? selectedPlan.tenure : (config?.tenure ?? null);
  const dpPercent = isMerchantPlan && selectedPlan?.dpPercent != null ? selectedPlan.dpPercent : (config?.dpPercent ?? null);
  const rawDpType = String(isMerchantPlan && selectedPlan?.dpType ? selectedPlan.dpType : (config?.dpType ?? '')).toLowerCase();
  const dpType = rawDpType.includes('percent') ? 'percentage' : rawDpType.includes('fix') ? 'fixed' : rawDpType;
  const emiPercent = isMerchantPlan && selectedPlan?.emiPercent != null ? selectedPlan.emiPercent : (config?.emiPercent ?? null);

  return { minAmount, maxAmount, selectedPlan, isMerchantPlan, tenure, dpPercent, dpType, emiPercent };
};

export default function StepRangeBand({ selectedShop, config, onChangeConfig, onNext, onBack, customizations = [], editId = null, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const merchantPresets = useMemo(() => parseMerchantPlans(selectedShop), [selectedShop]);

  const {
    minAmount,
    maxAmount,
    isMerchantPlan,
    tenure,
    dpPercent,
    dpType,
    emiPercent,
  } = useMemo(() => extractPlanParams(merchantPresets, config), [merchantPresets, config]);

  const isReadOnly = isMerchantPlan || disabled;

  const currentPlacements = useMemo(() => extractPlacements(config), [config]);

  // Detect active duplicate widget for the exact same shop, price range & overlapping locations
  const existingDuplicate = useMemo(() => {
    if (!selectedShop?.id && !selectedShop?.myshopifyDomain) return null;
    const minVal = Number(minAmount || 0);
    const maxVal = Number(maxAmount || 0);

    for (const item of customizations || []) {
      const isSameShop = Number(item.shopId) === Number(selectedShop?.id) || (item.myshopifyDomain && item.myshopifyDomain === selectedShop?.myshopifyDomain);
      const isSameRange = Number(item.minAmount || 0) === minVal && Number(item.maxAmount || 0) === maxVal;
      const isDifferent = editId ? String(item.id || item.customizationId) !== String(editId) : true;

      if (item.isActive !== false && isSameShop && isSameRange && isDifferent) {
        const itemPlacements = extractPlacements(item);
        const overlapping = currentPlacements.filter((placement) => itemPlacements.includes(placement));
        if (overlapping.length > 0) {
          return {
            customization: item,
            overlappingPlacements: overlapping,
            overlappingLabels: overlapping.map((placement) => LOCATION_LABELS[placement] || placement).join(', '),
          };
        }
      }
    }
    return null;
  }, [customizations, selectedShop, minAmount, maxAmount, currentPlacements, editId]);

  // Reset override checkbox if user changes to a non-duplicate range
  useEffect(() => {
    if (!existingDuplicate && config?.overrideDuplicateRange) {
      onChangeConfig({ ...config, overrideDuplicateRange: false });
    }
  }, [existingDuplicate]);

  // Auto-sync preset parameters into config state
  useEffect(() => {
    if (merchantPresets.length > 0 && !config?.isCustomRange) {
      const plan = merchantPresets.find((plan) => plan.min === config?.minAmount && plan.max === config?.maxAmount);
      if (plan && config?.tenure !== plan.tenure) {
        onChangeConfig({ ...config, minAmount: plan.min, maxAmount: plan.max, tenure: plan.tenure, dpPercent: plan.dpPercent, dpType: plan.dpType, emiPercent: plan.emiPercent, isCustomRange: false });
      }
    }
  }, [merchantPresets, config?.minAmount, config?.maxAmount, config?.tenure, config?.isCustomRange]);

  const handleSelectPreset = useCallback((plan) => {
    if (disabled) return;
    if (plan === 'custom') {
      onChangeConfig({ ...config, minAmount: 0, maxAmount: 0, tenure: null, dpPercent: null, dpType: 'percentage', emiPercent: null, isCustomRange: true, overrideDuplicateRange: false });
    } else {
      onChangeConfig({
        ...config,
        minAmount: plan.min,
        maxAmount: plan.max,
        tenure: plan.tenure,
        dpPercent: plan.dpPercent,
        dpType: plan.dpType,
        emiPercent: plan.emiPercent,
        isCustomRange: false,
        overrideDuplicateRange: false,
      });
    }
    setIsOpen(false);
  }, [config, onChangeConfig, disabled]);

  const updateParam = useCallback((key, value, isCustom = false) => {
    if (disabled) return;
    onChangeConfig({
      ...config,
      [key]: value,
      ...(isCustom ? { isCustomRange: true } : {}),
    });
  }, [config, onChangeConfig, disabled]);

  const selectedDisplayLabel = useMemo(
    () => getRangeBandDisplayLabel({ ...config, minAmount, maxAmount }, merchantPresets),
    [config, minAmount, maxAmount, merchantPresets]
  );

  const isInvalidTenure = !isReadOnly && tenure != null && (tenure < 1 || tenure > 60);
  const isInvalidDp = !isReadOnly && dpPercent != null && (dpType === 'percentage' || dpType === 'percent') && (dpPercent < 0 || dpPercent > 100);
  const isInvalidEmi = !isReadOnly && emiPercent != null && (emiPercent < 0 || emiPercent > 100);
  const isInvalidRange = !isReadOnly && (minAmount < 0 || (minAmount >= maxAmount && maxAmount > 0));

  const hasValidationError = isInvalidRange || isInvalidTenure || isInvalidDp || isInvalidEmi;
  const isDuplicateBlocked = Boolean(existingDuplicate && !config?.overrideDuplicateRange) && !disabled;
  const isNextDisabled = !disabled && (minAmount >= maxAmount || (!isMerchantPlan && maxAmount <= 0) || hasValidationError || isDuplicateBlocked);

  return (
    <Card className="w-full rounded-xl border border-gray-200/90 shadow-2xs bg-white overflow-visible">
      <CardHeader className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
        <CardTitle className="text-sm font-semibold text-gray-900 tracking-tight">
          Select Range Band
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-3.5">
        {/* Dropdown Section */}
        <div className="space-y-1 relative" ref={dropdownRef}>
          <Label className="text-xs font-semibold text-gray-700 block">Range Option</Label>

          <div className="relative">
            <div
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`w-full min-h-[38px] border rounded-lg px-3 py-2 flex items-center justify-between transition-all text-xs sm:text-sm font-medium text-gray-900 shadow-2xs ${disabled ? 'bg-gray-50/80 border-gray-200 cursor-not-allowed text-gray-700' : 'bg-white hover:bg-gray-50/50 border-gray-200 cursor-pointer'}`}
            >
              <span className="truncate">{selectedDisplayLabel}</span>
              <IconChevronDown className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-xs py-1">
                <div className="px-3.5 py-1.5 font-bold text-gray-900">
                  Merchant Plan Ranges
                </div>

                <div>
                  {merchantPresets.map((preset, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPreset(preset)}
                      className="px-5 py-1.5 cursor-pointer text-gray-800 hover:bg-gray-50 font-medium"
                    >
                      {preset.label}
                    </div>
                  ))}
                </div>

                <div className="px-3.5 py-1.5 font-bold text-gray-900 mt-0.5">
                  Custom Range
                </div>

                {config?.isCustomRange && maxAmount > minAmount && maxAmount > 0 && (
                  <div
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-1.5 cursor-pointer text-gray-800 hover:bg-gray-50 font-medium"
                  >
                    ₹{minAmount.toLocaleString('en-IN')} – ₹{maxAmount.toLocaleString('en-IN')}
                  </div>
                )}

                <div className="px-3.5 py-1.5 flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectPreset('custom')}
                    className={`rounded-full px-3 h-7 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-all border ${config?.isCustomRange && !(maxAmount > minAmount && maxAmount > 0)
                      ? 'bg-gray-200 text-gray-900 border-gray-300 font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200 shadow-none'
                      }`}
                  >
                    <IconSliders className="w-3 h-3 text-gray-600" />
                    <span>Custom range</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All 6 Parameters Grid with Compact Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3.5 gap-y-2.5">
          <FormField
            label="Minimum Amount (₹)"
            type="number"
            required={true}
            readOnly={isReadOnly}
            placeholder="0"
            value={minAmount === 0 && !isMerchantPlan ? '' : minAmount}
            onChange={(e) => updateParam('minAmount', Number(e.target.value) || 0, true)}
            error={minAmount < 0 ? "Min amount cannot be negative" : undefined}
          />

          <FormField
            label="Maximum Amount (₹)"
            type="number"
            required={true}
            readOnly={isReadOnly}
            placeholder="0"
            value={maxAmount === 0 && !isMerchantPlan ? '' : maxAmount}
            onChange={(e) => updateParam('maxAmount', Number(e.target.value) || 0, true)}
            error={isInvalidRange ? "Max amount must be greater than min amount" : undefined}
          />

          <FormField
            label="Tenure (Months)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={tenure != null ? tenure : ''}
            onChange={(e) => updateParam('tenure', e.target.value !== '' ? Number(e.target.value) : null)}
            error={isInvalidTenure ? "Tenure must be 1 to 60 months" : undefined}
          />

          <FormField
            label="Down Payment (%)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={dpPercent != null ? dpPercent : ''}
            onChange={(e) => updateParam('dpPercent', e.target.value !== '' ? Number(e.target.value) : null)}
            error={isInvalidDp ? "DP must be 0-100" : undefined}
          />

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700 block">DP Type</Label>
            <Select
              disabled={isReadOnly}
              value={dpType || 'percentage'}
              onValueChange={(val) => updateParam('dpType', val || 'percentage')}
            >
              <SelectTrigger
                className={`h-9 text-xs sm:text-sm px-3 rounded-lg font-medium transition-all disabled:opacity-100 ${isReadOnly
                  ? 'bg-gray-50/80 border-gray-200 text-gray-900 cursor-not-allowed select-none'
                  : 'bg-white border-gray-200 text-gray-900'
                  }`}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FormField
            label="EMI Rate (%)"
            type="number"
            readOnly={isReadOnly}
            placeholder="0"
            value={emiPercent != null ? emiPercent : ''}
            onChange={(e) => updateParam('emiPercent', e.target.value !== '' ? Number(e.target.value) : null)}
            error={isInvalidEmi ? "EMI rate must be 0-100" : undefined}
          />
        </div>

        {/* Existing Range Band Warning & Priority Override Checkbox */}
        {existingDuplicate && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <IconAlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-amber-900 block">Existing Widget Conflict for Selected Locations</span>
                <p className="text-amber-800 leading-relaxed font-medium">
                  This store already has an active widget configured for <strong className="font-bold text-amber-950">{existingDuplicate.overlappingLabels}</strong> in price range <strong className="font-bold text-amber-950">₹{Number(minAmount).toLocaleString('en-IN')} – ₹{Number(maxAmount).toLocaleString('en-IN')}</strong>. Replacing it will set the earlier widget for these locations to <strong className="font-bold text-amber-950">Inactive</strong> and make this new widget <strong className="font-bold text-amber-950">Active</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1.5 border-t border-amber-200/70">
              <Checkbox
                id="overrideDuplicateCheckbox"
                checked={Boolean(config?.overrideDuplicateRange)}
                onCheckedChange={(checked) => onChangeConfig({ ...config, overrideDuplicateRange: Boolean(checked) })}
              />
              <Label htmlFor="overrideDuplicateCheckbox" className="text-xs font-semibold text-amber-950 cursor-pointer select-none">
                Replace existing widget for this price range & locations
              </Label>
            </div>
          </div>
        )}

        <div className="border-b border-gray-100 pt-0.5" />

        <StepNavigation
          onBack={onBack}
          onNext={onNext}
          nextDisabled={isNextDisabled}
        />
      </CardContent>
    </Card>
  );
}

