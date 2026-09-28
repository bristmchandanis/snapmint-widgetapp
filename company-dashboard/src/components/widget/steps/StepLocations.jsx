import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IconAlertCircle } from '../../common/Icons';
import StepNavigation from '../../common/StepNavigation';

const LOCATIONS = [
  { id: 'displayPdp', code: 'PDP', label: 'PDP (Product Detail Page)', desc: 'Product page near buy button' },
  { id: 'displayCollection', code: 'COLLECTION', label: 'Collection', desc: 'Product grid item cards' },
  { id: 'displayCart', code: 'CART', label: 'Cart Page', desc: 'Cart page subtotal section' },
  // { id: 'displayMiniCart', code: 'MINICART', label: 'Mini Cart', desc: 'Cart drawer footer section' },
  { id: 'displayCartDrawer', code: 'CARTDRAWER', label: 'Cart Drawer', desc: 'Slide-out cart drawer footer' },
];

export default function StepLocations({ config, onChangeConfig, onNext, onBack, disabled = false }) {
  const toggleLocation = (id) => {
    if (disabled) return;
    const updated = { ...config, [id]: !config?.[id] };
    updated.placements = LOCATIONS.filter((location) => updated[location.id]).map((location) => location.code);
    onChangeConfig(updated);
  };

  const hasSelectedLocation = LOCATIONS.some((loc) => config?.[loc.id]);

  return (
    <Card className="w-full rounded-xl border border-gray-200/90 shadow-2xs bg-white overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <div>
          <CardTitle className="text-sm font-semibold text-gray-900 tracking-tight">
            Select Locations
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {LOCATIONS.map((loc) => {
              const isChecked = config[loc.id] ?? false;

              return (
                <div
                  key={loc.id}
                  onClick={() => toggleLocation(loc.id)}
                  className={`rounded-xl border transition-all duration-150 ${disabled
                    ? 'border-gray-200 bg-gray-50/70 cursor-not-allowed'
                    : isChecked
                      ? 'border-gray-900 bg-gray-50 shadow-sm cursor-pointer'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40 cursor-pointer'
                    }`}
                >
                  <div className="px-4 py-3 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900 leading-tight">
                        {loc.label}
                      </span>
                      <Switch
                        checked={isChecked}
                        disabled={disabled}
                        onCheckedChange={() => toggleLocation(loc.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {loc.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {!hasSelectedLocation && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5 animate-in fade-in duration-150">
              <IconAlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Please select at least one location to display your widget.</span>
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 pt-1" />

        <StepNavigation
          onBack={onBack}
          onNext={onNext}
          nextDisabled={!hasSelectedLocation}
        />
      </CardContent>
    </Card>
  );
}
