import DataTable from '../common/DataTable';
import { Card } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconPlus } from '../common/Icons';

const TABLE_HEADERS = [
  'Merchant',
  'Shopify store',
  'Coupons enabled',
  { label: 'Quick links', className: 'text-right' },
];

function getMerchantDisplayInfo(merchant) {
  const name = merchant.name || merchant.merchantName;
  const subtitle = merchant.merchantId || '';
  const shopDomain = merchant.shop || merchant.myshopifyDomain;
  const prefix = shopDomain.replace(/\.myshopify\.com$/i, '');
  const couponsCount = merchant.couponsEnabled ?? merchant.couponsCount ?? 0;

  return {
    name,
    subtitle,
    shopDomain: prefix ? `${prefix}.myshopify.com` : '',
    prefix,
    couponsCount,
  };
}

export default function MerchantTable({
  merchants = [],
  loading = false,
  canWrite = true,
  onAddMerchant,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            All merchants
          </h1>
        </div>

        <Button
          size="sm"
          onClick={onAddMerchant}
          disabled={!canWrite}
          className="rounded-md px-4 font-bold shadow-2xs self-start sm:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconPlus className="w-4 h-4 text-white" />
          Add Merchant
        </Button>
      </div>

      <Card className="rounded-2xl border border-gray-200 shadow-xs overflow-hidden bg-white">
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Merchants
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
              ({merchants.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <DataTable
            headers={TABLE_HEADERS}
            data={merchants}
            loading={loading}
            emptyMessage="No Merchants Registered Yet."
            renderRow={(merchant) => {
              const { name, subtitle, shopDomain, couponsCount } =
                getMerchantDisplayInfo(merchant);
              const hasDomain = Boolean(shopDomain && shopDomain !== '—');

              return (
                <TableRow
                  key={merchant.id || merchant.shop}
                  className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <div className="font-bold text-gray-900 text-sm tracking-tight">
                      {name}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {subtitle}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="text-xs font-mono text-gray-600 font-medium">
                      {hasDomain ? shopDomain : '—'}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="text-sm font-semibold text-gray-800">
                      {couponsCount}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 sm:gap-4">
                      {hasDomain && (
                        <span className="text-xs font-semibold text-gray-800 underline underline-offset-4 cursor-pointer">
                          Details
                        </span>
                      )}

                      <span className="text-xs font-semibold text-gray-800 underline underline-offset-4 cursor-pointer">
                        Plans
                      </span>

                      <span className="text-xs font-semibold text-gray-800 underline underline-offset-4 cursor-pointer">
                        Coupons
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
}
