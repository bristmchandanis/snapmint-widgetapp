import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiService } from '../utils/constants';
import { toast } from 'sonner';

import WidgetCustomizationTable from '../components/widget/WidgetCustomizationTable';
import WidgetStepper from '../components/widget/WidgetStepper';
import StepStoreSelection from '../components/widget/steps/StepStoreSelection';
import StepRangeBand from '../components/widget/steps/StepRangeBand';
import StepLocations from '../components/widget/steps/StepLocations';
import StepMasterWidget from '../components/widget/steps/StepMasterWidget';
import StepSelectors from '../components/widget/steps/StepSelectors';
import StepCustomization from '../components/widget/steps/StepCustomization';
import ConfirmModal from '../components/common/ConfirmModal';

import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconSpinner } from "../components/common/Icons";
import { appRoutesURL } from '../routes/appRoutesURL';
import { getModulePermissions } from '../utils/helpers';
import { buildConfigFromStyle, buildSavePayload, parseCustomizationResponse, extractAutoSetupPayload } from '../utils/widgetHelpers';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function WidgetCustomization({ user, mode }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeEditId, masterTemplateId: routeMasterTemplateId, deleteId: routeDeleteId } = useParams();

  const { canWrite: canWriteWidget, canEdit: canEditWidget } = getModulePermissions(user, 'widgetCustomization');

  const editId = routeEditId || searchParams.get('id');
  const deleteId = routeDeleteId || searchParams.get('deleteId') || searchParams.get('delete');
  const masterParam = routeMasterTemplateId || searchParams.get('master');
  const requestedMasterTemplateId = masterParam === 'master_2' || masterParam === '2'
    ? 'master_2'
    : masterParam === 'master_1' || masterParam === '1'
      ? 'master_1'
      : null;

  const isWizard = mode === 'create' || Boolean(editId);

  const wizardStep = Number(searchParams.get('step')) || 1;
  const setWizardStep = (nextStep) => {
    const nextVal = typeof nextStep === 'function' ? nextStep(wizardStep) : nextStep;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      step: nextVal,
    });
  };

  const [customizations, setCustomizations] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [masterTemplateId, setMasterTemplateId] = useState(requestedMasterTemplateId || 'master_1');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [widgetIdToDelete, setWidgetIdToDelete] = useState(null);
  const [deletingWidget, setDeletingWidget] = useState(false);

  const [config, setConfig] = useLocalStorage(
    editId ? `snapmint_draft_edit_config_${editId}` : 'snapmint_draft_create_config',
    () => {
      const base = buildConfigFromStyle(requestedMasterTemplateId || 'master_1');
      const savedLayout = typeof window !== 'undefined' ? sessionStorage.getItem('snapmint_inline_layout') : null;
      return savedLayout ? { ...base, layoutType: savedLayout } : base;
    }
  );

  const handleEditWidgetClick = useCallback((item) => {
    if (item?.id) {
      sessionStorage.setItem(`snapmint_edit_fresh_${item.id}`, 'true');
      try { localStorage.removeItem(`snapmint_draft_edit_config_${item.id}`); } catch { }
      navigate(`${appRoutesURL.widgetCustomization}/edit/${item.id}`);
    }
  }, [navigate]);

  const fetchShops = useCallback(async () => {
    try {
      const res = await apiService.getStores();
      if (res?.success && Array.isArray(res.shops)) {
        setShops(res.shops);
        const savedShopId = sessionStorage.getItem('snapmint_widget_selected_shop_id');
        const foundShop = savedShopId ? res.shops.find((s) => s.id === Number(savedShopId)) : null;
        if (foundShop) {
          setSelectedShop(foundShop);
        } else if (res.shops.length > 0) {
          setSelectedShop((prev) => prev || res.shops[0]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch shops list:', err?.message);
    }
  }, []);

  const fetchCustomizationsList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await apiService.getWidgetCustomizationsList();
      if (res?.success && Array.isArray(res.data)) {
        setCustomizations(res.data);
      }
    } catch (err) {
      toast.error(err?.message || 'Could not fetch widget customizations list.');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchAutoSetupForShop = useCallback(async (shopId) => {
    if (!shopId) return;
    try {
      const res = await apiService.getAutoSetup(shopId);
      const rawAuto = res?.data?.metafield?.value || res?.data;
      if (rawAuto && typeof rawAuto === 'object') {
        setConfig((prev) => {
          const effectiveLayout = prev?.layoutType || sessionStorage.getItem('snapmint_inline_layout') || rawAuto?.layoutType || 'singleRowButton';
          return {
            ...rawAuto,
            ...prev,
            layoutType: effectiveLayout,
          };
        });
      }
    } catch { }
  }, []);

  const fetchCustomizationById = useCallback(async (id) => {
    if (!id) return;
    setLoadingConfig(true);
    try {
      const res = await apiService.getWidgetCustomization(id);
      if (res?.success && res.data?.customization) {
        const { templateId, config: parsedConfig, shop: fetchedShop } = parseCustomizationResponse(res.data, id, selectedShop);
        if (parsedConfig?.layoutType) {
          sessionStorage.setItem('snapmint_inline_layout', parsedConfig.layoutType);
        }
        setMasterTemplateId(templateId);
        if (fetchedShop) setSelectedShop((prev) => prev || fetchedShop);

        const key = `snapmint_edit_fresh_${id}`;
        const isEdit = sessionStorage.getItem(key) === 'true';
        if (isEdit) sessionStorage.removeItem(key);

        setConfig((prev) => {
          const shopPlan = fetchedShop?.merchantPlan || selectedShop?.merchantPlan || prev?.merchantPlan;
          const merged = { ...parsedConfig, ...(shopPlan && { merchantPlan: shopPlan }) };
          const hasValidDraft = !isEdit && String(prev?.customizationId) === String(id);
          return hasValidDraft ? { ...merged, ...prev } : merged;
        });

        const shopIdNum = Number(parsedConfig.shopId || res.data.customization.shopId);
        if (shopIdNum) {
          sessionStorage.setItem('snapmint_widget_selected_shop_id', shopIdNum);
        }
      }
    } catch (err) {
      console.warn('Failed to load widget customization by ID:', err?.message);
    } finally {
      setLoadingConfig(false);
      setLoadingList(false);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (isWizard) {
      fetchShops();
      if (editId) fetchCustomizationById(editId);
    } else {
      fetchCustomizationsList();
    }
  }, [isWizard, editId]);

  useEffect(() => {
    if (editId && shops.length > 0 && config?.shopId && !selectedShop) {
      const matched = shops.find((s) => s.id === Number(config.shopId));
      if (matched) setSelectedShop(matched);
    }
  }, [editId, shops, config?.shopId, selectedShop]);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    if (shop?.id) {
      setConfig((prev) => buildConfigFromStyle(prev.masterTemplateLayout || masterTemplateId, prev, shop));
      sessionStorage.setItem('snapmint_widget_selected_shop_id', shop.id);
    }
  };

  useEffect(() => {
    if (!selectedShop?.id) return;
    sessionStorage.setItem('snapmint_widget_selected_shop_id', selectedShop.id);
    setConfig((prev) => buildConfigFromStyle(prev.masterTemplateLayout || masterTemplateId, prev, selectedShop));
    fetchAutoSetupForShop(selectedShop.id);
  }, [selectedShop?.id, editId]);

  const handleAddWidgetClick = () => {
    sessionStorage.removeItem('snapmint_inline_layout');
    setConfig(buildConfigFromStyle('master_1'));
    navigate(`${appRoutesURL.widgetCustomizationCreate}?step=1`);
    if (selectedShop?.id) {
      fetchAutoSetupForShop(selectedShop.id);
    }
  };

  const handleSelectMasterTemplate = (templateId) => {
    setMasterTemplateId(templateId);
    setConfig((prev) => ({
      ...prev,
      ...buildConfigFromStyle(templateId, prev),
      masterTemplateLayout: templateId,
    }));
  };

  const handleDeleteWidgetClick = (id) => {
    setWidgetIdToDelete(id);
  };

  const handleCloseDeleteModal = () => {
    setWidgetIdToDelete(null);
    if (deleteId) {
      navigate(appRoutesURL.widgetCustomization, { replace: true });
    }
  };

  const handleConfirmDeleteWidget = async () => {
    const targetId = deleteId || widgetIdToDelete;
    if (!targetId) return;
    setDeletingWidget(true);
    try {
      const res = await apiService.deleteWidgetCustomization(targetId);
      if (res?.success) {
        toast.success('Widget customization deleted successfully.');
        setCustomizations((prev) => prev.filter((c) => String(c.id || c.customizationId) !== String(targetId)));
        handleCloseDeleteModal();
      } else {
        toast.error(res?.message || 'Failed to delete widget customization.');
      }
    } catch (err) {
      toast.error(err?.message || 'Error deleting widget customization.');
    } finally {
      setDeletingWidget(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedShop?.id) {
      toast.error('Please select a target store in Step 1 first.');
      setWizardStep(1);
      return;
    }

    setSaving(true);
    try {
      const payload = buildSavePayload(config, selectedShop, masterTemplateId, editId);
      const res = editId
        ? await apiService.updateWidgetCustomization(payload)
        : await apiService.addWidgetCustomization(payload);

      if (res?.success) {
        // Simultaneously save Auto Setup Selectors (Step 5) to the store's auto_setups table and Shopify metafield (skipping duplicate log)
        try {
          const autoSetupPayload = {
            ...extractAutoSetupPayload(config, selectedShop),
            skipActivityLog: true,
          };
          await apiService.updateAutoSetup(autoSetupPayload);
        } catch (autoErr) {
          console.warn('AutoSetup sync notice:', autoErr?.message);
        }

        toast.success(`Widget customization saved successfully!`);
      } else {
        toast.error(res?.message || 'Failed to save widget customization.');
      }
    } catch (err) {
      toast.error(err?.message || 'An error occurred while saving widget customization.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackNavigation = () => {
    navigate(appRoutesURL.widgetCustomization, { replace: true });
  };

  const activeDeleteId = deleteId || widgetIdToDelete;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {isWizard && (
            <button
              type="button"
              onClick={handleBackNavigation}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
              title="Go Back to List"
            >
              <IconArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Widget Customization Flow
          </h1>
        </div>

        {!isWizard && (
          <Button
            size="sm"
            onClick={handleAddWidgetClick}
            disabled={!canWriteWidget}
            className="rounded-md px-4 font-bold shadow-2xs self-start sm:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Widget
          </Button>
        )}
      </div>

      {/* Render Table or Wizard Flow */}
      {!isWizard ? (
        <WidgetCustomizationTable
          customizations={customizations}
          loading={loadingList}
          onAddWidgetClick={handleAddWidgetClick}
          onEditWidgetClick={handleEditWidgetClick}
          onDeleteWidgetClick={handleDeleteWidgetClick}
          onRefresh={fetchCustomizationsList}
          canEdit={canEditWidget}
        />
      ) : (
        <div className="space-y-6">
          <WidgetStepper
            currentStep={wizardStep}
            onSelectStep={(stepNum) => setWizardStep(stepNum)}
          />

          {loadingConfig || (!selectedShop && shops.length === 0) ? (
            <div className="py-20 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-2xs">
              <IconSpinner className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {wizardStep === 1 && (
                <StepStoreSelection
                  shops={shops}
                  selectedShop={selectedShop}
                  onSelectShop={handleSelectShop}
                  onNext={() => setWizardStep(2)}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}

              {wizardStep === 2 && (
                <StepLocations
                  config={config}
                  onChangeConfig={setConfig}
                  onNext={() => setWizardStep(3)}
                  onBack={() => setWizardStep(1)}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}

              {wizardStep === 3 && (
                <StepRangeBand
                  selectedShop={selectedShop}
                  config={config}
                  onChangeConfig={setConfig}
                  onNext={() => setWizardStep(4)}
                  onBack={() => setWizardStep(2)}
                  customizations={customizations}
                  editId={editId}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}

              {wizardStep === 4 && (
                <StepMasterWidget
                  selectedInlineLayout={config?.layoutType}
                  onSelectInlineLayout={(layoutType, layoutProps = {}) => {
                    sessionStorage.setItem('snapmint_inline_layout', layoutType);
                    setConfig((prev) => ({
                      ...prev,
                      ...layoutProps,
                      layoutType,
                    }));
                  }}
                  selectedPopupLayout={config?.popupLayoutType || 'default'}
                  onSelectPopupLayout={(popupLayoutType) => {
                    setConfig((prev) => ({
                      ...prev,
                      popupLayoutType,
                    }));
                  }}
                  masterTemplateId={masterTemplateId}
                  onSelectTemplate={handleSelectMasterTemplate}
                  onNext={() => setWizardStep(5)}
                  onBack={() => setWizardStep(3)}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}

              {wizardStep === 5 && (
                <StepSelectors
                  config={config}
                  onChangeConfig={setConfig}
                  onNext={() => setWizardStep(6)}
                  onBack={() => setWizardStep(4)}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}

              {wizardStep === 6 && (
                <StepCustomization
                  masterTemplateId={masterTemplateId}
                  shops={shops}
                  selectedShop={selectedShop}
                  onSelectShop={setSelectedShop}
                  config={config}
                  onChangeConfig={setConfig}
                  onSaveConfig={handleSaveConfig}
                  saving={saving}
                  onBack={() => setWizardStep(5)}
                  disabled={!canEditWidget && !canWriteWidget}
                />
              )}
            </>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(activeDeleteId)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteWidget}
        title="Delete widget customization?"
        itemName={customizations.find((c) => String(c.id) === String(activeDeleteId))?.shop?.myshopifyDomain || customizations.find((c) => String(c.id) === String(activeDeleteId))?.myshopifyDomain}
        confirmText="Delete"
        variant="destructive"
        compact
        loading={deletingWidget}
      />
    </div>
  );
}
