import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/constants';
import { appRoutesURL } from '../routes/appRoutesURL';
import { hasPermission } from '../utils/helpers';
import {
  DEFAULT_INLINE_CONFIG,
  DEFAULT_INNER_COLORS,
  DEFAULT_MASTER_COLORS,
  COLOR_SECTION_CONFIGS,
} from '../utils/moduleData';
import { extractColorDefaults } from '../utils/widgetHelpers';
import ColorCustomizerSection from '../components/widget/ColorCustomizerSection';
import InlineBannerPreview from '../components/widget/InlineBannerPreview';
import TemplatePreview from '../components/widget/TemplatePreviews';
import { Button } from '@/components/ui/button';
import { IconSpinner, IconArrowLeft } from '../components/common/Icons';
import { toast } from 'sonner';

export default function ColorCustomization({ user }) {
  const { shopId: routeShopId } = useParams();
  const navigate = useNavigate();
  const canEdit = hasPermission(user, 'stores', 'edit');

  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openSections, setOpenSections] = useState({ inline: true, master: true });
  const [colors, setColors] = useState({ inline: DEFAULT_INNER_COLORS, master: DEFAULT_MASTER_COLORS });
  const [config, setConfig] = useState({});

  const fetchStoreConfig = useCallback(async (shopId) => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res = await apiService.getStoreColors(shopId);
      if (res?.success && res.data) {
        const storeData = res.data;
        setSelectedShop({
          id: shopId,
          name: storeData.name || storeData.myshopifyDomain,
          myshopifyDomain: storeData.myshopifyDomain,
        });

        const rawConfig = storeData.colorConfig || {};
        setConfig(rawConfig);

        setColors({
          inline: extractColorDefaults(DEFAULT_INNER_COLORS, rawConfig.innerLayoutColors),
          master: extractColorDefaults(DEFAULT_MASTER_COLORS, rawConfig.masterPopupColors),
        });
      }
    } catch (err) {
      console.warn('Failed to load store color configuration:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeShopId) fetchStoreConfig(Number(routeShopId));
  }, [routeShopId, fetchStoreConfig]);

  const isEditable = canEdit;

  const toggleSection = useCallback((id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const updateColor = useCallback((id, key, val) => {
    setColors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: val },
    }));
  }, []);

  const handleSave = async () => {
    if (!isEditable) return toast.error('Access denied. You do not have permission to edit store configuration.');
    if (!routeShopId) return toast.error('Store ID missing.');

    setSaving(true);
    try {
      const payload = {
        shopId: Number(routeShopId),
        myshopifyDomain: selectedShop?.myshopifyDomain,
        colorConfig: {
          innerLayoutColors: colors.inline,
          masterPopupColors: colors.master,
        },
      };

      const res = await apiService.saveStoreColors(payload);
      if (res?.success) {
        toast.success('Store layout colors saved successfully!');
      } else {
        toast.error(res?.message || 'Failed to save store colors.');
      }
    } catch (err) {
      toast.error(err?.message || 'An error occurred while saving store colors.');
    } finally {
      setSaving(false);
    }
  };

  const combinedPreviewConfig = useMemo(
    () => ({
      ...DEFAULT_INLINE_CONFIG,
      ...config,
      ...colors.inline,
      ...colors.master,
    }),
    [config, colors.inline, colors.master]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(appRoutesURL.stores)}
            title="Go Back to Stores"
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
          >
            <IconArrowLeft className="w-4 h-4 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-left">
              Color Customization
            </h1>
          </div>
        </div>

        <Button
          type="button"
          disabled={saving || loading || !isEditable}
          onClick={handleSave}
          title="Save Config"
          className="text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white px-5 h-9 rounded-lg shadow-2xs cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <IconSpinner className="w-3.5 h-3.5 animate-spin" />}
          {saving ? 'Saving' : 'Save Config'}
        </Button>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center bg-white rounded-xl border border-gray-200 p-8 shadow-2xs">
          <IconSpinner className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      ) : (
        <div className="space-y-6">
          {COLOR_SECTION_CONFIGS.map((sec) => (
            <ColorCustomizerSection
              key={sec.id}
              {...sec}
              isOpen={openSections[sec.id]}
              onToggle={() => toggleSection(sec.id)}
              colors={colors[sec.id]}
              disabled={!isEditable}
              onChangeColor={(k, v) => updateColor(sec.id, k, v)}
              preview={
                sec.id === 'inline' ? (
                  <div className="w-full bg-white p-3 rounded-lg border border-gray-200/80">
                    <InlineBannerPreview {...combinedPreviewConfig} compact />
                  </div>
                ) : (
                  <div className="p-0 flex items-center justify-center py-1 overflow-hidden">
                    <div className="transform scale-85 sm:scale-95 origin-center -my-6 sm:-my-4">
                      <TemplatePreview
                        templateId={config?.masterTemplateLayout || 'master_1'}
                        sampleAmount={3000}
                        {...combinedPreviewConfig}
                      />
                    </div>
                  </div>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
