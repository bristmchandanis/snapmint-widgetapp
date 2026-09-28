import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useMatch, useSearchParams } from 'react-router-dom';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useSelector } from 'react-redux';
import { appRoutesURL } from '../routes/appRoutesURL';
import {
  Page,
  Section,
  Stack,
  Banner,
  Text,
  Button,
  Box,
  Spinner,
} from '../components/ui';
import WidgetStepper from '../components/widget/WidgetStepper';
import WidgetCustomizationTable from '../components/widget/WidgetCustomizationTable';
import StepRangeBand from '../components/widget/steps/StepRangeBand';
import StepLocations from '../components/widget/steps/StepLocations';
import StepMasterLayout from '../components/widget/steps/StepMasterLayout';
import StepSelectors from '../components/widget/steps/StepSelectors';
import StepCustomization from '../components/widget/steps/StepCustomization';
import { apiService } from '../../utils/Constent';
import {
  buildConfigFromStyle,
  buildSavePayload,
  parseCustomizationResponse,
  extractAutoSetupPayload,
} from '../utils/widgetHelpers';

export default function Widget() {
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const [searchParams, setSearchParams] = useSearchParams();
  const { storeDetails } = useSelector((state) => state.shop);

  const createMatch = useMatch(`${appRoutesURL.widget}/create`);
  const editMatch = useMatch(`${appRoutesURL.widget}/edit/:id`);

  const isCreate = Boolean(createMatch);
  const editId = editMatch?.params?.id || null;
  const isWizard = isCreate || Boolean(editId);

  // ─── Table State ───
  const [widgets, setWidgets] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(null);
  const [deleteWidgetId, setDeleteWidgetId] = useState(null);

  // ─── Flow / Wizard State ───
  const step = Number(searchParams.get('step')) || 1;
  const setStep = (nextStep) => {
    const nextVal = typeof nextStep === 'function' ? nextStep(step) : nextStep;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      step: nextVal,
    });
  };

  const [masterTemplateId, setMasterTemplateId] = useState('master_1');
  const [config, setConfig] = useState(() => buildConfigFromStyle('master_1'));
  const [flowLoading, setFlowLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flowError, setFlowError] = useState(null);

  // ─── Fetch Table Widgets ───
  const fetchWidgets = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await apiService.getStoreWidgets();
      if (response?.success || response?.data) {
        const raw = response?.data?.customizations || response?.data?.widgets || response?.data || response?.customizations || response?.widgets || [];
        const list = Array.isArray(raw) ? raw : [];
        setWidgets(list);
      } else {
        setTableError(response?.message || 'Failed to fetch widgets');
      }
    } catch (err) {
      setTableError(err?.message || 'Error fetching widgets');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isWizard) {
      fetchWidgets();
    }
  }, [isWizard, fetchWidgets]);

  const confirmDelete = async () => {
    if (!deleteWidgetId) return;
    setTableLoading(true);
    try {
      const res = await apiService.deleteWidgetCustomization(deleteWidgetId);
      if (res?.success || res?.apiStatus === 200) {
        setDeleteWidgetId(null);
        fetchWidgets();
      } else {
        setTableError(res?.message || 'Failed to delete widget');
        setTableLoading(false);
      }
    } catch (err) {
      setTableError(err?.message || 'Error deleting widget');
      setTableLoading(false);
    }
  };

  // ─── Fetch Wizard Data ───
  const fetchAutoSetupForShop = useCallback(async () => {
    try {
      const autoRes = await apiService.getAutoSetup();
      const rawAuto = autoRes?.data?.metafield?.value || autoRes?.data;
      if (rawAuto && typeof rawAuto === 'object') {
        setConfig((prev) => ({ ...prev, ...rawAuto }));
      }
    } catch (e) {
      console.warn('AutoSetup sync note:', e?.message);
    }
  }, []);

  const fetchCustomizationById = useCallback(async (customizationId) => {
    if (!customizationId) return;
    setFlowLoading(true);
    try {
      const res = await apiService.getWidgetCustomization(customizationId);
      if (res?.success && res.data?.customization) {
        const { templateId, config: parsedConfig } = parseCustomizationResponse(res.data, customizationId);
        setMasterTemplateId(templateId);
        setConfig(parsedConfig);
      } else {
        setFlowError(res?.message || 'Failed to load widget customization');
      }
    } catch (err) {
      setFlowError(err?.message || 'Error loading widget customization');
    } finally {
      setFlowLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isWizard) {
      if (editId) {
        fetchCustomizationById(editId).then(() => fetchAutoSetupForShop());
      } else {
        setMasterTemplateId('master_1');
        setConfig(buildConfigFromStyle('master_1', storeDetails));
        fetchAutoSetupForShop();
      }
    }
  }, [isWizard, editId, fetchCustomizationById, fetchAutoSetupForShop, storeDetails]);

  const goBackToTable = useCallback(() => {
    navigate(appRoutesURL.widget);
    fetchWidgets();
  }, [navigate, fetchWidgets]);

  const handleSelectTemplate = (templateId) => {
    setMasterTemplateId(templateId);
    setConfig((prev) => buildConfigFromStyle(templateId, prev));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSaveConfig = async () => {
    setSaving(true);
    setFlowError(null);
    try {
      const payload = buildSavePayload(config, storeDetails, masterTemplateId, editId);
      // Match company-dashboard pattern: use editId to decide add vs update
      const res = editId
        ? await apiService.saveWidgetCustomization(payload, editId)
        : await apiService.saveWidgetCustomization(payload);

      if (res?.success || res?.apiStatus === 200) {
        try {
          await apiService.saveAutoSetup({
            ...extractAutoSetupPayload(config, storeDetails),
            skipActivityLog: true,
          });
        } catch (autoErr) {
          console.warn('AutoSetup sync note:', autoErr?.message);
        }

        await fetchWidgets();
        shopify?.toast?.show?.('Widget customization saved successfully!');
        goBackToTable();
      } else {
        shopify?.toast?.show?.(res?.message || 'Failed to save widget.');
        setFlowError(res?.message || 'Failed to save widget customization.');
      }
    } catch (err) {
      shopify?.toast?.show?.('Error saving widget customization.');
      setFlowError(err?.message || 'Error saving widget customization.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Permission Check ───
  if (storeDetails && (storeDetails.allowCustomization === '0' || storeDetails.allowCustomization === 0)) {
    return (
      <Page heading="Widget Customization">
        <Stack gap="base" paddingBlockStart="base">
          <Section>
            <Banner tone="warning">
              <Stack gap="small">
                <Text>
                  You do not have permission to customize widgets. If you wish
                  to enable customization, please contact the Snapmint support
                  team.
                </Text>
              </Stack>
            </Banner>
          </Section>
        </Stack>
      </Page>
    );
  }

  // ─── WIZARD / FLOW VIEW ───
  if (isWizard) {
    return (
      <Page
        heading={editId ? 'Edit Widget Customization' : 'Create Widget Customization'}
        breadcrumbAction={{ label: 'Back to Widgets', onClick: goBackToTable }}
      >
        <Box paddingBlockStart="base">
          <Stack gap="base">
            {flowError && (
              <Section>
                <Banner tone="critical">
                  <Text>{flowError}</Text>
                </Banner>
              </Section>
            )}

            <Section>
              <WidgetStepper currentStep={step} />
            </Section>

            {flowLoading || !storeDetails ? (
              <Section>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  padding="large-400"
                  minBlockSize="160px"
                >
                  <Spinner />
                </Stack>
              </Section>
            ) : (
              <>
                {step === 1 && (
                  <StepLocations
                    config={config}
                    onChangeConfig={setConfig}
                    onNext={handleNext}
                    onBack={goBackToTable}
                  />
                )}

                {step === 2 && (
                  <StepRangeBand
                    storeDetails={storeDetails}
                    config={config}
                    onChangeConfig={setConfig}
                    onNext={handleNext}
                    onBack={handleBack}
                    existingWidgets={widgets}
                    editId={editId}
                  />
                )}

                {step === 3 && (
                  <StepMasterLayout
                    masterTemplateId={masterTemplateId}
                    onSelectTemplate={handleSelectTemplate}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {step === 4 && (
                  <StepSelectors
                    config={config}
                    onChangeConfig={setConfig}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {step === 5 && (
                  <StepCustomization
                    storeDetails={storeDetails}
                    config={config}
                    onChangeConfig={setConfig}
                    masterTemplateId={masterTemplateId}
                    onSaveConfig={handleSaveConfig}
                    saving={saving}
                    onBack={handleBack}
                  />
                )}
              </>
            )}
          </Stack>
        </Box>
      </Page>
    );
  }

  // ─── TABLE VIEW ───
  return (
    <Page
      heading="Widget Customization"
      primaryAction={{
        label: 'Add Widget',
        onClick: () => navigate(`${appRoutesURL.widget}/create?step=1`),
      }}
    >
      <s-section padding="none">
        {tableError && (
          <Banner tone="critical">
            <Text>{tableError}</Text>
          </Banner>
        )}

        <WidgetCustomizationTable
          widgets={widgets}
          loading={tableLoading}
          onEdit={(widget) => navigate(`${appRoutesURL.widget}/edit/${widget.id}?step=1`)}
          onDelete={(widget) => setDeleteWidgetId(widget.id)}
        />
      </s-section>

      <s-modal id="delete-widget-modal" heading="Delete Widget" size="small">
        <Text>
          Are you sure you want to delete this widget customization? This action
          cannot be undone.
        </Text>
        <Button
          slot="secondary-actions"
          command="--hide"
          commandFor="delete-widget-modal"
        >
          Cancel
        </Button>
        <Button
          slot="primary-action"
          variant="primary"
          tone="critical"
          command="--hide"
          commandFor="delete-widget-modal"
          onClick={confirmDelete}
        >
          Delete
        </Button>
      </s-modal>
    </Page>
  );
}
