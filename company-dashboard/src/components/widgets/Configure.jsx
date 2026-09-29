import { useState, useCallback, memo } from 'react';
import { FileText, PanelRight, ShoppingBag, CreditCard, ArrowRight, Minus, Equal, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FormField from '../common/FormField';
import { toast } from 'sonner';

const PLACEMENTS = [
  { id: 'pdp', title: 'PDP', desc: 'Product detail page', Icon: FileText },
  { id: 'mini-cart', title: 'Mini cart', desc: 'A quick look before checkout', Icon: PanelRight },
  { id: 'cart', title: 'Cart', desc: 'The full shopping bag', Icon: ShoppingBag },
  { id: 'checkout', title: 'Checkout', desc: 'The final step to purchase', Icon: CreditCard },
];

const POPUP_TYPES = [
  { value: 'info', label: 'Info' },
  { value: 'express', label: 'Express' },
  { value: 'eligibility-payment', label: 'Eligibility · Payment selection' },
  { value: 'eligibility-emi', label: 'Eligibility · 0% EMI' },
];

const CAPTURE_OPTIONS = [
  { key: 'size', label: 'Size' },
  { key: 'colour', label: 'Colour' },
  { key: 'coupons', label: 'Coupons' },
  { key: 'shipping', label: 'Shipping fee' },
];

const WIDGET_LINES = [
  { val: 'single', label: 'Single-line', Icon: Minus },
  { val: 'two', label: 'Two-line', Icon: Equal },
];

const cfg = (line, type, coupons = false) => ({
  enabled: true, widgetLine: line, popupType: type,
  capture: { size: true, colour: true, coupons, shipping: false }, shippingThreshold: '',
});

const DEFAULT_CONFIG = {
  pdp: cfg('two', 'info'),
  'mini-cart': cfg('single', 'express'),
  cart: cfg('single', 'eligibility-payment'),
  checkout: cfg('single', 'express', true),
};

const PlacementCard = memo(function PlacementCard({ item, data, onChange }) {
  const { id, title, desc, Icon } = item;
  const isEnabled = data.enabled;
  const isExpress = isEnabled && data.popupType === 'express';

  const update = (field, val) => onChange(id, { ...data, [field]: val });

  return (
    <Card className={`rounded-2xl border transition-all p-5 sm:p-6 bg-white ${isEnabled ? 'border-gray-200 shadow-xs' : 'border-gray-100 bg-gray-50/20'}`}>
      <CardHeader className="p-0 flex flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isEnabled ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-bold text-gray-900 text-sm tracking-tight">{title}</CardTitle>
            <CardDescription className="text-xs text-gray-500 font-normal">{desc}</CardDescription>
          </div>
        </div>

        <Switch
          checked={isEnabled}
          onCheckedChange={(val) => update('enabled', val)}
          className="data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200"
        />
      </CardHeader>

      {!isEnabled ? (
        <CardDescription className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
          Turn on this placement to configure its pop-up.
        </CardDescription>
      ) : (
        <CardContent className="p-0 mt-5 space-y-4 pt-4 border-t border-gray-100">
          <div>
            <Label className="block text-xs font-semibold text-gray-700 mb-1.5">Widget line</Label>
            <Tabs value={data.widgetLine} onValueChange={(val) => update('widgetLine', val)} variant="pills" className="w-full space-y-0">
              <TabsList className="mb-0 bg-gray-100/90 border border-gray-200/80 rounded-lg p-1 gap-1">
                {WIDGET_LINES.map(({ val, label, Icon: LineIcon }) => (
                  <TabsTrigger key={val} value={val} className="border-none py-1.5 text-xs font-semibold text-black gap-1.5">
                    <LineIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label className="block text-xs font-semibold text-gray-700 mb-1.5">Popup type</Label>
            <Select value={data.popupType} onValueChange={(val) => update('popupType', val)}>
              <SelectTrigger className="w-full h-9.5 text-xs bg-white border-gray-200 font-medium">
                <SelectValue placeholder="Select popup type" />
              </SelectTrigger>
              <SelectContent>
                {POPUP_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isExpress && (
            <div className="p-3.5 bg-gray-50/70 border border-gray-200/60 rounded-xl space-y-3">
              <p className="text-[11px] font-semibold text-gray-500">Include in your Express pop-up</p>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-700 font-medium">
                {CAPTURE_OPTIONS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`${id}-${key}`}
                      checked={Boolean(data.capture?.[key])}
                      onCheckedChange={(checked) => update('capture', { ...data.capture, [key]: checked })}
                    />
                    <Label htmlFor={`${id}-${key}`} className="text-xs text-gray-700 font-medium cursor-pointer select-none">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>

              {data.capture?.shipping && (
                <div className="pt-2 border-t border-gray-200/60 max-w-[200px]">
                  <FormField
                    id={`${id}-shipping`}
                    label="Shipping fee applies below"
                    type="number"
                    placeholder="e.g. 1000"
                    icon={IndianRupee}
                    value={data.shippingThreshold || ''}
                    onChange={(e) => update('shippingThreshold', e.target.value)}
                    hint="At or above this order value, shipping is free."
                    className="h-8 pl-8 text-xs font-medium"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
});

export default function Configure({ initialConfig, onContinue }) {
  const [config, setConfig] = useState(() => initialConfig || DEFAULT_CONFIG);
  const activeCount = Object.values(config).filter((c) => c.enabled).length;

  const handlePlacementChange = useCallback((id, updatedData) => {
    setConfig((prev) => ({ ...prev, [id]: updatedData }));
  }, []);

  const handleSave = () => {
    toast.success('Placement configuration saved successfully!');
    if (onContinue) onContinue(config);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Configure</h1>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">Active placements</h2>
        <span className="text-xs text-gray-500 font-medium">{activeCount} of {PLACEMENTS.length} active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLACEMENTS.map((item) => (
          <PlacementCard
            key={item.id}
            item={item}
            data={config[item.id] || DEFAULT_CONFIG[item.id]}
            onChange={handlePlacementChange}
          />
        ))}
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-gray-100">
        <Button
          type="button"
          onClick={handleSave}
          className="rounded-md h-8 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center gap-2"
        >
          <span>Continue to Customisation</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
