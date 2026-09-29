import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiService, ONBOARDING_STEPS } from '../utils/constants';
import { getModulePermissions } from '../utils/helpers';
import { appRoutesURL } from '../routes/appRoutesURL';
import Stepper from '../components/common/Stepper';
import AddMerchant from '../components/merchant/AddMerchant';
import MerchantTable from '../components/merchant/MerchantTable';
import Plans from '@/components/widgets/Plans';
import PriceBands from '@/components/widgets/PriceBands';
import Configure from '@/components/widgets/Configure';

export default function AllMerchants({ user, mode }) {
  const navigate = useNavigate();
  const { editId: routeEditId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { canWrite } = getModulePermissions(user, 'merchantOnboard');

  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);

  const onboardingStep = Number(searchParams.get('step')) || 1;
  const setOnboardingStep = (step) => setSearchParams({ step });
  const [wizardData, setWizardData] = useState({});

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

  // Sync route params with modals
  useEffect(() => {
    if (mode === 'create') {
      setEditingMerchant(null);
      setAddModalOpen(true);
    } else if (routeEditId) {
      const found = merchants.find((m) => String(m.id) === String(routeEditId));
      if (found) {
        setEditingMerchant(found);
        setEditModalOpen(true);
      }
    } else {
      setAddModalOpen(false);
      setEditModalOpen(false);
    }
  }, [mode, routeEditId, merchants]);

  const handleCloseModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setEditingMerchant(null);
    setWizardData({});
    navigate(appRoutesURL.merchantOnboard);
  };

  const handleOpenAddModal = () => {
    setEditingMerchant(null);
    setAddModalOpen(true);
    navigate(`${appRoutesURL.merchantOnboard}/create?step=1`);
  };

  // Steps Flow
  if (mode === 'create' || addModalOpen) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 w-full pb-12">
        <Stepper
          steps={ONBOARDING_STEPS}
          currentStep={onboardingStep}
          onStepClick={setOnboardingStep}
        />

        {onboardingStep === 1 && (
          <AddMerchant
            initialData={wizardData}
            onCancel={handleCloseModals}
            onSuccess={(step1Data) => {
              setWizardData((prev) => ({ ...prev, ...step1Data }));
              setOnboardingStep(2);
            }}
            disabled={!canWrite}
          />
        )}

        {onboardingStep === 2 && (
          <Plans
            initialPlans={wizardData.plans}
            onBack={() => setOnboardingStep(1)}
            onContinue={(plans) => {
              setWizardData((prev) => ({ ...prev, plans }));
              setOnboardingStep(3);
            }}
          />
        )}

        {onboardingStep === 3 && (
          <PriceBands
            plans={wizardData.plans}
            onBack={() => setOnboardingStep(2)}
            onContinue={(priceBandsData) => {
              setWizardData((prev) => ({ ...prev, priceBands: priceBandsData }));
              setOnboardingStep(4);
            }}
          />
        )}

        {onboardingStep === 4 && (
          <Configure
            merchantName={wizardData.name || editingMerchant?.name}
            brandingMode={wizardData.brandingMode || editingMerchant?.brandingMode}
            initialConfig={wizardData.configuration}
            onBack={() => setOnboardingStep(3)}
            onContinue={(configuration) => {
              setWizardData((prev) => ({ ...prev, configuration }));
              setOnboardingStep(5);
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
      onAddMerchant={handleOpenAddModal}
    />
  );
}
