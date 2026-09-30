import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconArrowRight, IconArrowLeft } from '../common/Icons';

const BRANDING_LABELS = {
  snapmint: 'Snapmint',
  'co-branded': 'Co-branded',
  'white-label': 'White label',
};

const formatBrandingMode = (mode) => BRANDING_LABELS[mode] || 'Snapmint';

export default function MerchantDetails({
  merchant,
  onNextPlans,
  onBack,
  onEdit,
}) {
  if (!merchant) return null;

  const rows = [
    { label: 'Merchant name', value: merchant.name || '—' },
    { label: 'Merchant ID', value: merchant.merchantId || '—' },
    { label: 'Shopify store', value: merchant.shop || '—' },
    { label: 'Branding', value: formatBrandingMode(merchant.brandingMode) },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {onBack && (
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>All merchants</span>
          </button>
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Merchant details
        </h1>
      </div>

      <Card className="rounded-2xl border border-gray-200/80 shadow-xs bg-white p-6 sm:p-7 space-y-6">
        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Merchant details
          </h2>
          <p className="text-xs text-gray-500 font-normal mt-1">
            Review this merchant's saved details.
          </p>
        </div>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="py-4 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">{label}</span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="rounded-lg h-9 px-4 border-gray-200 text-gray-900 hover:bg-gray-50 text-xs font-semibold cursor-pointer shadow-2xs"
          >
            Edit details
          </Button>

          <Button
            type="button"
            onClick={onNextPlans}
            className="rounded-lg h-9 px-5 bg-[#ff5a00] hover:bg-[#e04f00] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <span>Next: Plans</span>
            <IconArrowRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
