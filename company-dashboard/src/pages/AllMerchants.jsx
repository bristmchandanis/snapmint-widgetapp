import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiService, ONBOARDING_STEPS } from '../utils/constants';
import { getModulePermissions } from '../utils/helpers';
import { appRoutesURL } from '../routes/appRoutesURL';
import Stepper from '../components/common/Stepper';
import AddMerchant from '../components/merchant/AddMerchant';
import MerchantDetails from '../components/merchant/MerchantDetails';
import MerchantTable from '../components/merchant/MerchantTable';
import Plans from '@/components/widgets/Plans';
import PriceBands from '@/components/widgets/PriceBands';
import Configure from '@/components/widgets/Configure';
import Customization from '@/components/widgets/Customization';
import Coupons from '@/components/widgets/Coupons';
import Targeting from '@/components/widgets/Targeting';
import { IconSpinner } from '../components/common/Icons';
import { toast } from 'sonner';

const STEP_MAP = {
  merchant: 1,
  plans: 2,
  'price-bands': 3,
  configure: 4,
  customisation: 5,
  customization: 5,
  coupons: 6,
  targeting: 7,
};

export default function AllMerchants({ user, mode }) {
  const navigate = useNavigate();
  const { editId: routeEditId, merchantId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { canWrite } = getModulePermissions(user, 'merchantOnboard');

  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wizardData, setWizardData] = useState({});

  const activeMerchantId = routeEditId || merchantId;
  const isEditMode = mode === 'edit';
  const isDetailsMode = mode === 'details' || (Boolean(merchantId) && !isEditMode);
  const isCreateMode = mode === 'create';
  const isWizardOpen = isCreateMode || isEditMode || isDetailsMode;

  const stepParam = searchParams.get('step');
  const onboardingStep = STEP_MAP[stepParam] || Number(stepParam) || 1;
  const setOnboardingStep = (step) => setSearchParams({ step });

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getMerchantCredentials();
      if (res?.success && Array.isArray(res.merchants)) {
        setMerchants(res.merchants);
      }
    } catch (err) {
      console.warn('Failed to load merchant credentials:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const targetMerchant =
    merchants.find((m) => String(m.id) === String(activeMerchantId)) ||
    (wizardData?.id ? wizardData : null);

  useEffect(() => {
    const shopDomain = targetMerchant?.shop || wizardData?.shop;
    if (!shopDomain) return;
    apiService.getWidgetCustomization({ shopDomain })
      .then((res) => {
        const widget = res?.widget || res?.data?.widget || res?.data?.customization || res?.data;
        if (widget) {
          setWizardData((prev) => {
            const plans = (Array.isArray(widget.plans) && widget.plans.length > 0)
              ? widget.plans
              : (Array.isArray(prev.plans) && prev.plans.length > 0 ? prev.plans : []);

            const priceBands = (widget.priceBands && Object.keys(widget.priceBands).length > 0)
              ? widget.priceBands
              : (prev.priceBands || {});

            const configuration = (widget.configure && Object.keys(widget.configure).length > 0)
              ? widget.configure
              : (prev.configuration || {});

            const customization = (widget.customization && Object.keys(widget.customization).length > 0)
              ? widget.customization
              : (prev.customization || {});

            const targeting = (widget.targeting && Object.keys(widget.targeting).length > 0)
              ? widget.targeting
              : (prev.targeting || {});

            return {
              ...prev,
              plans,
              priceBands,
              configuration,
              customization,
              targeting,
            };
          });
        }
      })
      .catch((err) => console.warn('Could not pre-load widget data for merchant:', err?.message));
  }, [targetMerchant?.shop]);

  const handleClose = () => {
    setWizardData({});
    navigate(isEditMode ? `${appRoutesURL.merchantOnboard}/${activeMerchantId}?step=1` : appRoutesURL.merchantOnboard);
  };

  const handleOpenCreate = () => {
    navigate(`${appRoutesURL.merchantOnboard}/create?step=1`);
  };

  if ((isEditMode || isDetailsMode) && loading && !targetMerchant) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <IconSpinner className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (isWizardOpen) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 w-full pb-12">
        <Stepper
          steps={ONBOARDING_STEPS}
          currentStep={onboardingStep}
          onStepClick={setOnboardingStep}
        />

        {onboardingStep === 1 && (
          isDetailsMode ? (
            <MerchantDetails
              merchant={targetMerchant}
              onNextPlans={() => setOnboardingStep(2)}
              onEdit={() => navigate(`${appRoutesURL.merchantOnboard}/edit/${activeMerchantId}`)}
            />
          ) : (
            <AddMerchant
              initialData={isEditMode ? targetMerchant : wizardData}
              isEdit={isEditMode}
              onCancel={handleClose}
              onSuccess={(step1Data) => {
                setWizardData((prev) => ({
                  ...prev,
                  ...step1Data,
                  id: isEditMode ? (targetMerchant?.id || activeMerchantId) : prev.id,
                  shop: step1Data.shop || prev.shop || targetMerchant?.shop,
                }));
                setOnboardingStep(2);
              }}
              disabled={!canWrite}
            />
          )
        )}

        {onboardingStep === 2 && (
          <Plans
            initialPlans={wizardData.plans || []}
            onBack={() => setOnboardingStep(1)}
            onContinue={(plans) => {
              setWizardData((prev) => ({ ...prev, plans }));
              setOnboardingStep(3);
            }}
          />
        )}

        {onboardingStep === 3 && (
          <PriceBands
            plans={wizardData.plans || []}
            initialPriceBands={wizardData.priceBands || {}}
            onBack={() => setOnboardingStep(2)}
            onContinue={(priceBandsData) => {
              setWizardData((prev) => ({ ...prev, priceBands: priceBandsData }));
              setOnboardingStep(4);
            }}
          />
        )}

        {onboardingStep === 4 && (
          <Configure
            merchantName={wizardData.name || targetMerchant?.name}
            brandingMode={wizardData.brandingMode || targetMerchant?.brandingMode}
            initialConfig={wizardData.configuration || {}}
            onBack={() => setOnboardingStep(3)}
            onContinue={(configuration) => {
              setWizardData((prev) => ({ ...prev, configuration }));
              setOnboardingStep(5);
            }}
          />
        )}

        {onboardingStep === 5 && (
          <Customization
            merchantName={wizardData.name || targetMerchant?.name || "Neeman's"}
            brandingMode={wizardData.brandingMode || targetMerchant?.brandingMode || "snapmint"}
            plans={wizardData.plans || []}
            priceBands={wizardData.priceBands || {}}
            configuration={wizardData.configuration || {}}
            initialCustomization={wizardData.customization || {}}
            onBack={() => setOnboardingStep(4)}
            onContinue={(customization) => {
              setWizardData((prev) => ({
                ...prev,
                customization,
                ...(customization?.brandingMode ? { brandingMode: customization.brandingMode } : {}),
              }));
              setOnboardingStep(6);
            }}
          />
        )}

        {onboardingStep === 6 && (
          <Coupons
            merchant={targetMerchant}
            wizardData={wizardData}
            onBack={() => setOnboardingStep(5)}
            onGoToConfigure={() => setOnboardingStep(4)}
            onContinue={(couponsData) => {
              setWizardData((prev) => ({ ...prev, ...couponsData }));
              setOnboardingStep(7);
            }}
          />
        )}

        {onboardingStep === 7 && (
          <Targeting
            wizardData={wizardData}
            selectedShop={targetMerchant || (wizardData.shop ? { name: wizardData.name, myshopifyDomain: wizardData.shop } : null)}
            onBack={() => setOnboardingStep(6)}
            onComplete={async (targetingData) => {
              setWizardData((prev) => ({ ...prev, ...targetingData }));

              let savedMerchant = targetMerchant;
              try {
                if (isEditMode) {
                  const payload = {
                    id: targetMerchant?.id || activeMerchantId,
                    name: wizardData.name || targetMerchant?.name,
                    shop: wizardData.shop || targetMerchant?.shop,
                    merchantId: wizardData.merchantId || targetMerchant?.merchantId,
                    brandingMode: wizardData.brandingMode || targetMerchant?.brandingMode,
                  };
                  const res = await apiService.updateMerchantCredential(payload);
                  if (res?.merchant) savedMerchant = res.merchant;
                } else {
                  const payload = {
                    name: wizardData.name,
                    shop: wizardData.shop,
                    merchantId: wizardData.merchantId,
                    brandingMode: wizardData.brandingMode || 'snapmint',
                  };
                  const res = await apiService.addMerchantCredential(payload);
                  if (res?.merchant) savedMerchant = res.merchant;
                }
              } catch (err) {
                console.error('Failed to save merchant credentials:', err);
                toast.error(err?.message || 'Failed to save merchant credentials');
                return;
              }

              const finalShopId = savedMerchant?.id || targetMerchant?.id || activeMerchantId;
              const finalShopDomain = wizardData?.shop || savedMerchant?.shop || targetMerchant?.shop;

              if (finalShopId) {
                try {
                  await apiService.updateAutoSetup({
                    shopId: finalShopId,
                    myshopifyDomain: finalShopDomain,
                    ...targetingData,
                  });
                } catch (err) {
                  console.warn('Failed to save auto setup targeting:', err?.message);
                }
              }

              try {
                await apiService.saveWidgetCustomization({
                  shopId: finalShopId,
                  shopDomain: finalShopDomain,
                  plans: wizardData.plans || targetMerchant?.plans || [],
                  priceBands: wizardData.priceBands || targetMerchant?.priceBands || {},
                  configure: wizardData.configuration || targetMerchant?.configuration || {},
                  customization: wizardData.customization || targetMerchant?.customization || {},
                  targeting: targetingData,
                  isActive: true,
                });
                toast.success(isEditMode ? 'Merchant updated successfully!' : 'Merchant onboarded successfully!');
                await fetchMerchants();
                handleClose();
              } catch (err) {
                console.error('Failed to save final widget customization:', err);
                toast.error(err?.message || 'Failed to save widget customization');
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <MerchantTable
      merchants={merchants}
      loading={loading}
      canWrite={canWrite}
      onAddMerchant={handleOpenCreate}
    />
  );
}
