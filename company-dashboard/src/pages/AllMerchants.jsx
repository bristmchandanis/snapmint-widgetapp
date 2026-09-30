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
import { IconSpinner } from '../components/common/Icons';

const STEP_MAP = {
  merchant: 1,
  plans: 2,
  'price-bands': 3,
  configure: 4,
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
              onBack={handleClose}
              onNextPlans={() => setOnboardingStep(2)}
              onEdit={() => navigate(`${appRoutesURL.merchantOnboard}/edit/${activeMerchantId}`)}
            />
          ) : (
            <AddMerchant
              initialData={isEditMode ? targetMerchant : wizardData}
              onCancel={handleClose}
              onSuccess={(step1Data) => {
                if (isEditMode) {
                  fetchMerchants();
                  handleClose();
                } else {
                  setWizardData((prev) => ({ ...prev, ...step1Data }));
                  setOnboardingStep(2);
                }
              }}
              disabled={!canWrite}
            />
          )
        )}

        {onboardingStep === 2 && (
          <Plans
            initialPlans={
              targetMerchant?.plans && targetMerchant.plans.length > 0
                ? targetMerchant.plans
                : wizardData.plans
            }
            onBack={() => setOnboardingStep(1)}
            onContinue={(plans) => {
              setWizardData((prev) => ({ ...prev, plans }));
              setOnboardingStep(3);
            }}
          />
        )}

        {onboardingStep === 3 && (
          <PriceBands
            plans={wizardData.plans || targetMerchant?.plans}
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
            initialConfig={wizardData.configuration || targetMerchant?.configuration}
            onBack={() => setOnboardingStep(3)}
            onContinue={(configuration) => {
              setWizardData((prev) => ({ ...prev, configuration }));
              handleClose();
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
