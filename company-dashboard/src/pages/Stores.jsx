import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, ONBOARD_FILTER_OPTIONS } from '../utils/constants';
import { appRoutesURL } from '../routes/appRoutesURL';
import {
  calculateShopMetrics,
  filterShops,
  normalizeShopData,
  getModulePermissions,
} from '../utils/helpers';
import MetricCard from '../components/common/MetricCard';
import Filter from '../components/common/Filter';
import Pagination from '../components/common/Pagination';
import DataTable from '../components/common/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  IconCheckCircle,
  IconBuilding,
  IconShield,
  IconLayers,
  IconPencil,
} from '../components/common/Icons';

const METRICS_ITEMS = [
  { key: 'total', label: 'Total Stores', icon: IconBuilding, valueColor: 'text-gray-900', badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200/80' },
  { key: 'installed', label: 'Installed', icon: IconCheckCircle, valueColor: 'text-gray-900', badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200/80' },
  { key: 'enabled', label: 'Enabled', icon: IconShield, valueColor: 'text-gray-900', badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200/80' },
  { key: 'approved', label: 'Approved', icon: IconLayers, valueColor: 'text-gray-900', badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200/80' },
];

export default function Stores({ user }) {
  const navigate = useNavigate();
  const { canEdit } = getModulePermissions(user, 'stores');
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onboardFilter, setOnboardFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleAllowCustomizationChange = useCallback(async (shopId, checked) => {
    const targetShop = allShops.find((s) => s.id === shopId);
    if (checked && targetShop && targetShop.onboardStatusVal !== 'APPROVED') {
      toast.error('Only approved stores allowed.');
      return;
    }

    setAllShops((prev) =>
      prev.map((shopItem) => (shopItem.id === shopId ? { ...shopItem, allowCustomization: checked } : shopItem))
    );
    try {
      const res = await apiService.saveWidgetCustomization({
        shopId,
        allowCustomization: checked ? '1' : '0',
      });
      if (res?.success) {
        toast.success('Customization setting updated.');
      } else {
        throw new Error(res?.message || 'Failed to update customization setting.');
      }
    } catch (err) {
      setAllShops((prev) =>
        prev.map((shopItem) => (shopItem.id === shopId ? { ...shopItem, allowCustomization: !checked } : shopItem))
      );
      toast.error(err?.message || 'Failed to update customization setting.');
    }
  }, [allShops]);

  const handleWebPixelChange = useCallback(async (shopId, checked) => {
    const targetShop = allShops.find((s) => s.id === shopId);
    if (checked && targetShop && targetShop.onboardStatusVal !== 'APPROVED') {
      toast.error('Only approved stores allowed.');
      return;
    }

    setAllShops((prevList) =>
      prevList.map((shopItem) => (shopItem.id === shopId ? { ...shopItem, hasWebPixel: checked } : shopItem))
    );
    try {
      const res = await apiService.updateStoreWebPixel({
        id: shopId,
        hasWebPixel: checked ? '1' : '0',
      });
      if (res?.success) {
        toast.success(res?.message || 'Web Pixel tracking setting updated.');
      } else {
        throw new Error(res?.message || 'Failed to update web pixel setting.');
      }
    } catch (err) {
      setAllShops((prevList) =>
        prevList.map((shopItem) => (shopItem.id === shopId ? { ...shopItem, hasWebPixel: !checked } : shopItem))
      );
      toast.error(err?.message || 'Failed to update web pixel setting.');
    }
  }, [allShops]);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getStores();
      if (res?.success && Array.isArray(res.shops)) {
        setAllShops(res.shops.map(normalizeShopData));
      }
    } catch (err) {
      console.warn('Failed to load store directory:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredShops = useMemo(
    () => filterShops(allShops, search, onboardFilter),
    [allShops, search, onboardFilter]
  );

  const metrics = useMemo(
    () => calculateShopMetrics(allShops),
    [allShops]
  );

  const totalShops = filteredShops.length;
  const totalPages = Math.max(1, Math.ceil(totalShops / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, onboardFilter, pageSize]);

  const paginatedShops = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredShops.slice(startIdx, startIdx + pageSize);
  }, [filteredShops, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Stores Dashboard
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS_ITEMS.map((item) => (
          <MetricCard
            key={item.key}
            label={item.label}
            value={metrics[item.key]}
            icon={item.icon}
            valueColor={item.valueColor}
            badgeStyle={item.badgeStyle}
          />
        ))}
      </div>

      {/* Main Stores Table Card */}
      <Card className="rounded-xl border border-gray-200 shadow-none overflow-hidden bg-white">
        <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-gray-700" />
                Registered Merchant Stores
              </CardTitle>
            </div>

            <Filter
              search={search}
              onSearchChange={setSearch}
              onboardFilter={onboardFilter}
              onOnboardFilterChange={setOnboardFilter}
              onboardOptions={ONBOARD_FILTER_OPTIONS}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto w-full">
          <DataTable

            headers={[
              'Store Info',
              // 'Owner',
              'Shopify Plan',
              'Created Date',
              'App Install',
              'Onboard Status',
              'Widget Status',
              'Customization',
              'Web Pixel',
              'Actions',
            ]}
            data={paginatedShops}
            loading={loading}
            emptyMessage="No merchant stores found."
            renderRow={(shop) => (
              <TableRow key={shop.id || shop.myshopifyDomain}>
                <TableCell>
                  <div className="font-bold text-gray-900 text-sm tracking-tight">
                    {shop.name}
                  </div>
                  <div className="text-[11px] font-medium text-gray-500 bg-gray-100/80 border border-gray-200/60 px-2 py-0.5 rounded-md inline-block mt-1 truncate max-w-55">
                    {shop.myshopifyDomain}
                  </div>
                </TableCell>

                {/*<TableCell>*/}
                {/*  <div className="font-bold text-gray-800 text-xs">{shop.shopOwner}</div>*/}
                {/*  <div className="text-gray-500 text-xs mt-0.5 font-normal truncate max-w-45">*/}
                {/*    {shop.email}*/}
                {/*  </div>*/}
                {/*</TableCell>*/}

                <TableCell>
                  <div className="font-semibold text-gray-800 text-xs">{shop.planName}</div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <div className="font-semibold text-gray-700 text-xs font-sans tracking-normal whitespace-nowrap">
                    {shop.createdDate}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={shop.isInstalled ? 'installed' : 'uninstalled'}>
                    {shop.isInstalled ? 'Installed' : 'Uninstalled'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className={`inline-flex items-center justify-center h-7.5 px-3.5 rounded-full text-xs font-semibold ${shop.onboardStatusStyle}`}>
                    {shop.onboardStatusVal === 'APPROVED' ? 'Approved' : 'Pending'}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge variant={shop.widgetStatusVal === 'Enabled' ? 'enabled' : 'disabled'}>
                    {shop.widgetStatusVal}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Switch
                    checked={shop.allowCustomization === true}
                    disabled={!canEdit}
                    onCheckedChange={(checked) => handleAllowCustomizationChange(shop.id, checked)}
                  />
                </TableCell>

                <TableCell className="text-center">
                  <Switch
                    checked={shop.hasWebPixel === true}
                    disabled={!canEdit}
                    onCheckedChange={(checked) => handleWebPixelChange(shop.id, checked)}
                  />
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    type="button"
                    size="icon"
                    disabled={!canEdit}
                    onClick={() => navigate(`${appRoutesURL.colorCustomization}/edit/${shop.id}`)}
                    title={!canEdit ? 'Access denied: edit permission required' : 'Edit Store Colors'}
                    className="w-8 h-8 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconPencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />

          {/* Table Footer Pagination */}
          {!loading && totalShops > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={totalShops}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
