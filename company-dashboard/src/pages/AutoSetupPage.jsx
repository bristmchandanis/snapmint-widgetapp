import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/constants';
import { appRoutesURL } from '../routes/appRoutesURL';
import { hasPermission } from '../utils/helpers';
import AutoSetupTabSelectors from '../components/widget/AutoSetupTabSelectors';
import { Button } from '@/components/ui/button';
import { IconSpinner, IconArrowLeft } from '../components/common/Icons';
import { toast } from 'sonner';

export default function AutoSetupPage({ user }) {
  const { shopId: routeShopId } = useParams();
  const navigate = useNavigate();

  const canEdit = hasPermission(user, 'stores', 'edit');

  const [selectedShop, setSelectedShop] = useState(null);
  const [config, setConfig] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAutoSetupForShop = useCallback(async (shopId) => {
    if (!shopId) return;
    setLoadingConfig(true);
    try {
      const res = await apiService.getAutoSetup(shopId);
      if (res?.success && res.data) {
        const rawConfig = res.data.metafield?.value || res.data;
        setConfig(rawConfig);
      } else {
        setConfig({});
      }
    } catch (err) {
      console.warn('Failed to load auto setup config:', err?.message);
      setConfig({});
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    if (routeShopId) {
      const targetId = Number(routeShopId);
      setSelectedShop({ id: targetId });
      fetchAutoSetupForShop(targetId);
    }
  }, [routeShopId, fetchAutoSetupForShop]);

  const handleSave = async () => {
    if (!canEdit) {
      toast.error('Access denied. You do not have permission to edit store configuration.');
      return;
    }

    if (!selectedShop?.id) {
      toast.error('Store not found.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        shopId: selectedShop.id,
        myshopifyDomain: selectedShop.myshopifyDomain,
        ...config,
      };
      const res = await apiService.updateAutoSetup(payload);
      if (res?.success) {
        toast.success(`Auto setup selectors saved for ${selectedShop.name || selectedShop.myshopifyDomain}!`);
        navigate(appRoutesURL.stores);
      } else {
        toast.error(res?.message || 'Failed to save auto setup selectors.');
      }
    } catch (err) {
      toast.error(err?.message || 'An error occurred while saving auto setup selectors.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(appRoutesURL.stores)}
          title="Go Back to Stores"
        >
          <IconArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Auto Setup Configuration
          </h1>
        </div>
      </div>

      {/* Auto Setup Selectors Form */}
      {loadingConfig ? (
        <div className="py-20 flex items-center justify-center bg-white rounded-xl border border-gray-200 p-8 shadow-2xs">
          <IconSpinner className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      ) : (
        <>
          <AutoSetupTabSelectors
            config={config}
            onChangeConfig={setConfig}
            showAllTabs={true}
          />

          {/* Bottom Save Action Button */}
          <div className="pt-2 flex items-center justify-end">
            <Button
              type="button"
              disabled={saving || loadingConfig || !selectedShop || !canEdit}
              onClick={handleSave}
              className="text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-2xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving' : 'Save Selectors'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
