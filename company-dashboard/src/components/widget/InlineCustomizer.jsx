import React, { useMemo } from 'react';
import FormField from '../common/FormField';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { IconChevronDown, IconChevronUp } from '../common/Icons';
import InlineBannerPreview from './InlineBannerPreview';
import { DEFAULT_INLINE_CONFIG, getPricingFields } from '../../utils/moduleData';
import { parseMerchantPlans } from '../../utils/helpers';

const BADGE_CONFIGS = [
  { prefix: 'newBadge', toggleKey: 'isNewBadge', label: 'New Badge', placeholder: 'e.g. NEW' },
  { prefix: 'discountBadge', toggleKey: 'isDiscountBadge', label: 'Discount Badge', placeholder: 'e.g. Flat 10% cashback up to ₹300' },
];

const MINIMAL_DEFAULTS = {
  pricePrefixText: 'Pay',
  priceText: '{price}/mo',
  emiOptionText: 'No Cost EMI with',
};

const getDownPaymentAndEmi = (orderValue = 0, plan = {}) => {
  if (!plan || !plan.dpType) {
    return { downPayment: 0, emi: 0 };
  }
  if (plan.dpType === "fixed") {
    return {
      downPayment: Math.round(plan.dpRate),
      emi: Math.round((orderValue - plan.dpRate) / plan.tenure),
    };
  }
  return {
    downPayment: Math.round(orderValue * plan.dpRate),
    emi: Math.round(orderValue * plan.emiAmountRate),
  };
};

export default function InlineBannerCustomizer({
  selectedShop,
  config,
  onChangeConfig,
  disabled = false,
  isOpen,
  onToggle,
}) {
  const currentLayout = config?.layoutType || 'singleRowButton';
  const isMinimal = currentLayout.toLowerCase().includes('minimal');
  const showUpiToggle = !isMinimal;
  const hasCTA = !isMinimal;
  const hasBadges = !isMinimal;
  const merchantPresets = useMemo(() => parseMerchantPlans(selectedShop), [selectedShop]);

  const updateConfig = (key, val) => {
    if (!disabled && onChangeConfig) {
      onChangeConfig({ ...config, [key]: val });
    }
  };

  const plans = useMemo(
    () =>
      (config?.merchantPlan?.plans || []).map((p) => ({
        dpRate: p.dp_rate,
        dpType: p.dp_type,
        minAmount: p.min_order_value,
        maxAmount: p.max_order_value,
        emiAmountRate: p.emi_amount_rate,
        tenure: p.tenure,
      })),
    [config?.merchantPlan?.plans],
  );

  const price = useMemo(() => {
    const raw = (config.minAmount * 10) / 2;
    return raw;
  }, [config.minAmount]);

  const applicablePlans = useMemo(() => {
    if (!price) return [];
    return plans.filter((p) => price >= p.minAmount && price <= p.maxAmount);
  }, [price, plans]);

  const defaultEmiData = useMemo(() => {
    if (applicablePlans.length > 0) {
      const lowestTenurePlan = [...applicablePlans].sort(
        (a, b) => Number(a.tenure) - Number(b.tenure),
      )[0];
      const { downPayment, emi } = getDownPaymentAndEmi(price, lowestTenurePlan);
      return { downPayment, emi, tenure: lowestTenurePlan.tenure };
    }
    return null;
  }, [price, applicablePlans]);

  const dynamicTenures = useMemo(() => {
    if (config?.isCustomRange) return config?.tenure ? String(config.tenure) : "";
    if (!applicablePlans.length) return config?.tenure ? String(config.tenure) : "";
    const tenures = applicablePlans.map((p) => p.tenure);
    const uniqueTenures = Array.from(new Set(tenures)).sort((a, b) => a - b);
    return uniqueTenures.join("/");
  }, [applicablePlans, config?.tenure, config?.isCustomRange]);

  const sampleEmiPrice = useMemo(
    () => (defaultEmiData?.emi ? `₹${defaultEmiData.emi.toLocaleString('en-IN')}` : undefined),
    [defaultEmiData],
  );

  const isSingleTenure = Boolean(dynamicTenures && !dynamicTenures.includes('/'));
  const pricingFields = getPricingFields(isMinimal, isSingleTenure);
  const layoutLabel = currentLayout.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
  const snapmintChecked = config?.isBranding !== false;
  const upiChecked = Boolean(config?.isUpiBranding);

  const renderTextField = (key, label, placeholder, helpText = null) => {
    const minimalDefault = isMinimal ? MINIMAL_DEFAULTS[key] : null;
    const prefixDefault = key === 'pricePrefixText' ? (isMinimal ? 'Pay' : (isSingleTenure ? 'Or' : '')) : null;
    const val = config?.[key] !== undefined && config?.[key] !== null && config?.[key] !== '{price}/month' && config?.[key] !== '{tenure} months EMI options'
      ? config[key]
      : (prefixDefault || minimalDefault || DEFAULT_INLINE_CONFIG[key] || '');

    return (
      <div key={key}>
        <FormField
          id={key}
          name={key}
          label={label}
          placeholder={placeholder}
          value={val}
          readOnly={disabled}
          required={false}
          onChange={(e) => updateConfig(key, e.target.value)}
        />
        {helpText && (
          <p className="text-[10.5px] text-gray-400 mt-1 text-left">
            Use <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono text-[10px]">{helpText}</code>
          </p>
        )}
      </div>
    );
  };

  const renderToggle = (checked, onCheckedChange, label) => (
    <div className="flex items-center gap-1.5">
      <Switch
        checked={checked}
        disabled={disabled}
        className="scale-75 origin-left -mr-1"
        onCheckedChange={onCheckedChange}
      />
      <Label className="text-xs font-bold text-gray-800 cursor-pointer">{label}</Label>
    </div>
  );

  return (
    <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden w-full">
      <div
        onClick={onToggle}
        className="p-4 bg-[#f8fafc] hover:bg-slate-100/90 flex flex-row items-center justify-between cursor-pointer select-none transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-900 text-left">Inline Banner Customization</h3>
        <div className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {isOpen ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-5 bg-white border-t border-gray-200 animate-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1 text-left">
                <Label className="text-xs font-semibold text-gray-700 block">Layout Type</Label>
                <div className="w-full h-9 px-3.5 flex items-center text-xs font-semibold bg-white border border-gray-200 rounded-lg text-gray-900 cursor-default">
                  {layoutLabel}
                </div>
              </div>

              <div className="space-y-2.5 text-left">
                <Label className="text-xs font-bold text-gray-700 block">Branding</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {renderToggle(snapmintChecked, (checked) => updateConfig('isBranding', checked), 'Snapmint Branding')}
                  {showUpiToggle && renderToggle(upiChecked, (checked) => updateConfig('isUpiBranding', checked), 'UPI Branding')}
                  {isMinimal && renderToggle(config?.isInfoIcon !== false, (checked) => updateConfig('isInfoIcon', checked), 'Info Icon')}
                </div>
              </div>

              {hasBadges && (
                <div className="space-y-2.5 text-left">
                  <Label className="text-xs font-bold text-gray-700 block">Badges</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {BADGE_CONFIGS.map(({ prefix, toggleKey, label, placeholder }) => (
                      <div className="space-y-2 text-left" key={prefix}>
                        {renderToggle(
                          Boolean(config?.[toggleKey]),
                          (checked) => updateConfig(toggleKey, checked),
                          label
                        )}
                        <div className={`pt-1 w-full ${!config?.[toggleKey] ? 'pointer-events-none' : ''}`}>
                          {renderTextField(`${prefix}Text`, 'Badge Text', placeholder)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                {pricingFields.map((field) => renderTextField(field.key, field.label, field.placeholder, field.help))}
                {isMinimal && renderTextField('infoTooltipText', 'Info Tooltip Text', 'e.g. Calculate EMI options')}
                {hasCTA && renderTextField('ctaText', 'CTA Text', 'e.g. Buy on EMI')}
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-6">
              <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
                <div className="px-4 py-3 bg-[#f8fafc] border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 text-left">Live Preview</h3>
                </div>
                <CardContent className="p-3 bg-gray-50/50 space-y-2">
                  <div className="w-full bg-white p-3 rounded-lg border border-gray-200/80 text-left space-y-2">
                    <InlineBannerPreview
                      {...config}
                      compact
                      type={dynamicTenures}
                      samplePrice={sampleEmiPrice}
                      pricePrefixText={config?.pricePrefixText || ''}
                      merchantPresets={merchantPresets}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
