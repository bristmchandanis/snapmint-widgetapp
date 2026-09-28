import { useState, useMemo } from 'react';
import Filter from '../common/Filter';
import DataTable from '../common/DataTable';
import { formatDate } from '../../utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconLayers, IconPencil, IconTrash, IconEye } from '../common/Icons';

const parsePlacements = (placements, fallback) => {
  if (Array.isArray(placements) && placements.length > 0) return placements;
  if (typeof placements === 'string') {
    try {
      const parsed = JSON.parse(placements);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { }
  }
  return fallback ? [fallback] : ['PDP'];
};

const parseRowItem = (item) => {
  const minAmt = Number(item.minAmount || 0);
  const maxAmt = Number(item.maxAmount || 0);

  return {
    shopDomain: item.shop?.myshopifyDomain || item.myshopifyDomain || 'N/A',
    shopName: item.shop?.name,
    placementsList: parsePlacements(item.placements, item.placement),
    isActive: item.isActive !== false,
    rangeText: minAmt || maxAmt
      ? `₹${minAmt.toLocaleString('en-IN')} - ₹${maxAmt.toLocaleString('en-IN')}`
      : 'All Ranges',
  };
};

export default function WidgetCustomizationTable({
  customizations = [],
  loading = false,
  onEditWidgetClick,
  onDeleteWidgetClick,
  canEdit = true,
  canDelete = true,
}) {
  const [search, setSearch] = useState('');

  const filteredCustomizations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customizations;
    return customizations.filter((item) => {
      const shopName = item.shop?.name || '';
      const domain = item.shop?.myshopifyDomain || item.myshopifyDomain || '';
      const shopIdStr = String(item.shopId || '');
      const layoutStr = String(item.masterTemplateLayout || '');
      return (
        shopName.toLowerCase().includes(query) ||
        domain.toLowerCase().includes(query) ||
        shopIdStr.includes(query) ||
        layoutStr.toLowerCase().includes(query)
      );
    });
  }, [customizations, search]);

  return (
    <Card className="rounded-xl border border-gray-200 shadow-none overflow-hidden bg-white">
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <IconLayers className="w-4 h-4 text-gray-700" />
              Configured Widget Customizations
            </CardTitle>
          </div>

          <Filter
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search records"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto w-full">
        <DataTable
          headers={[
            'Shop Domain',
            'Master Layout',
            'Price Range',
            'Placements',
            'Status',
            'Created Date',
            { label: 'Actions', className: 'text-center' },
          ]}
          data={filteredCustomizations}
          loading={loading}
          emptyMessage={search ? 'No matching records found.' : 'No Widget Customizations Created Yet.'}
          renderRow={(item) => {
            const { shopDomain, shopName, placementsList, isActive, rangeText } = parseRowItem(item);

            return (
              <TableRow key={item.id || item.shopId}>
                <TableCell className="whitespace-nowrap min-w-50">
                  <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{shopDomain}</div>
                  {shopName && <div className="text-xs text-gray-500 whitespace-nowrap">{shopName}</div>}
                </TableCell>

                <TableCell className="whitespace-nowrap min-w-32.5">
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 font-semibold text-xs uppercase whitespace-nowrap inline-flex items-center px-2.5 py-0.5">
                    {String(item.masterTemplateLayout || 'master_1').replace('_', ' ')}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs font-semibold text-gray-800">
                  {rangeText}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 items-center">
                    {placementsList.map((p) => (
                      <span key={p} className="text-[11px] font-medium text-gray-700 bg-gray-100/90 border border-gray-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {p}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <Badge variant={isActive ? 'active' : 'disabled'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs font-medium text-gray-600">
                  {formatDate(item.createdAt || item.created_at)}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => onEditWidgetClick(item)}
                      title={canEdit ? "Edit Widget Customization" : "View Widget Customization"}
                      className="w-8 h-8 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all cursor-pointer shadow-2xs"
                    >
                      {canEdit ? <IconPencil className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </Button>

                    {canEdit && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => onDeleteWidgetClick(item.id)}
                        title="Delete Customization"
                        className="w-8 h-8 rounded-md text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                      >
                        <IconTrash className="w-4 h-4 text-rose-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
