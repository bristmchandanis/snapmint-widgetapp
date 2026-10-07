import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormField from '../common/FormField';
import SimpleSelect from '../common/SimpleSelect';
import { apiService } from '../../utils/constants';
import { toast } from 'sonner';

const POSITION_OPTIONS = [
  { label: 'After', value: 'after' },
  { label: 'Before', value: 'before' },
  { label: 'Inside start', value: 'inside start' },
  { label: 'Inside end', value: 'inside end' },
];

const VARIANT_OPTIONS = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
];

const PLACEMENT_FIELDS = {
  PDP: [
    { key: 'pdpWidgetAppendTarget', label: 'Inject at (CSS selector)', placeholder: '.product__price', span: 'md:col-span-3' },
    { key: 'pdpWidgetPlacement', label: 'Position', type: 'select', options: POSITION_OPTIONS, defaultValue: 'after' },
    { key: 'pdpSalePrice', label: 'Read order value from', placeholder: '.price-item--sale', span: 'md:col-span-3' },
    { key: 'pdpRerenderOnVariant', label: 'Re-render on variant', type: 'select', options: VARIANT_OPTIONS, defaultValue: 'on' },
    { key: 'pdpFallbackSelector', label: 'Fallback selectors', placeholder: '.price, [data-price]', span: 'md:col-span-4' },
  ],
  Mini: [
    { key: 'minCartWidgetAppendTarget', label: 'Inject at (CSS selector)', placeholder: '.cart-drawer__footer', span: 'md:col-span-3' },
    { key: 'minCartWidgetPlacement', label: 'Position', type: 'select', options: POSITION_OPTIONS, defaultValue: 'after' },
    { key: 'minCartTotal', label: 'Read order value from', placeholder: '.cart-drawer__total', span: 'md:col-span-4' },
    { key: 'minCartFallbackSelector', label: 'Fallback selectors', placeholder: '.totals__total-value', span: 'md:col-span-4' },
  ],
  Cart: [
    { key: 'cartWidgetAppendTarget', label: 'Inject at (CSS selector)', placeholder: '.cart__footer', span: 'md:col-span-3' },
    { key: 'cartWidgetPlacement', label: 'Position', type: 'select', options: POSITION_OPTIONS, defaultValue: 'after' },
    { key: 'cartTotal', label: 'Read order value from', placeholder: '.cart__subtotal', span: 'md:col-span-4' },
    { key: 'cartFallbackSelector', label: 'Fallback selectors', placeholder: '.cart-total', span: 'md:col-span-4' },
  ],
};

const EXCLUSION_FIELDS = [
  { key: 'excludedProducts', label: 'Excluded product handles / IDs', placeholder: 'e.g. gift-card, clearance-item' },
  { key: 'excludedCollections', label: 'Excluded collections', placeholder: 'e.g. regulated, alcohol' },
];

const DEFAULTS = {
  pdpWidgetAppendTarget: '.product__price',
  pdpWidgetPlacement: 'after',
  pdpSalePrice: '.price-item--sale',
  pdpFallbackSelector: '.price, [data-price]',
  pdpRerenderOnVariant: 'on',
  minCartWidgetPlacement: 'after',
  cartWidgetPlacement: 'after',
};

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1 text-left">
      <Label className="text-xs font-semibold text-gray-700 block">{label}</Label>
      <SimpleSelect
        value={value}
        onValueChange={onChange}
        options={options}
        triggerClassName="w-full h-10 text-xs font-medium bg-white border-gray-200"
      />
    </div>
  );
}

export default function Targeting({
  wizardData = {},
  onBack,
  onComplete,
  selectedShop,
}) {
  const [activePlacement, setActivePlacement] = useState('PDP');
  const [saving, setSaving] = useState(false);
  const shopId = selectedShop?.id || wizardData?.shopId;

  const [formData, setFormData] = useState(() => ({
    ...DEFAULTS,
    ...wizardData,
    pdpSalePrice: wizardData?.pdpSalePrice || DEFAULTS.pdpSalePrice,
  }));

  useEffect(() => {
    if (!shopId) return;

    apiService.getAutoSetup(shopId)
      .then((res) => {
        if (res?.data) {
          const config = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          setFormData((prev) => ({
            ...prev,
            ...config,
            pdpSalePrice: config.pdpSalePrice || prev.pdpSalePrice,
          }));
        }
      })
      .catch(() => {
        try {
          const cached = JSON.parse(localStorage.getItem(`snapmint_targeting_${shopId}`));
          if (cached) setFormData((prev) => ({ ...prev, ...cached }));
        } catch (_) { }
      });
  }, [shopId]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (shopId) {
        try {
          localStorage.setItem(`snapmint_targeting_${shopId}`, JSON.stringify(next));
        } catch (_) { }
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const myshopifyDomain = selectedShop?.myshopifyDomain || wizardData?.myshopifyDomain;
    const payload = { shopId, myshopifyDomain, ...formData };

    try {
      if (!onComplete && shopId) {
        await apiService.updateAutoSetup(payload);
        toast.success('Targeting configuration saved successfully!');
      }
    } catch (err) {
      if (!onComplete) {
        toast.error(err?.message || 'Failed to save targeting to server, saved locally.');
      }
    } finally {
      setSaving(false);
      onComplete?.(payload);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Targeting
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Placement</h2>
        <Tabs
          value={activePlacement}
          onValueChange={setActivePlacement}
          variant="pills"
          className="w-fit space-y-0"
        >
          <TabsList className="mb-0 inline-grid w-auto rounded-lg bg-gray-100 p-1 gap-1 border-gray-200/70">
            {Object.keys(PLACEMENT_FIELDS).map((tab) => {
              const isActive = activePlacement === tab;
              return (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all ${isActive
                    ? 'bg-black text-white border-black hover:bg-black hover:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 border-transparent'
                    }`}
                >
                  {tab}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900">
          Selectors · {activePlacement}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {PLACEMENT_FIELDS[activePlacement].map((field) => (
            <div key={field.key} className={field.span || 'md:col-span-1'}>
              {field.type === 'select' ? (
                <SelectField
                  label={field.label}
                  value={formData[field.key] || field.defaultValue}
                  onChange={(val) => handleChange(field.key, val)}
                  options={field.options}
                />
              ) : (
                <FormField
                  label={field.label}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Product / collection exclusions
          </h2>
          <p className="text-[11px] text-gray-500 font-normal mt-0.5">
            SOW G-02 — the widget hides on excluded products/collections (plus any regulatory exclusion list). Comma-separated handles or IDs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {EXCLUSION_FIELDS.map((field) => (
            <FormField
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-md h-9 px-4 border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Coupons</span>
            </Button>
          )}
        </div>

        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-md h-9 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-all disabled:opacity-50"
        >
          {saving ? 'Saving' : 'Save targeting'}
        </Button>
      </div>
    </div>
  );
}
