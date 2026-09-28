import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/constants';
import { appRoutesURL } from '../routes/appRoutesURL';
import { getModulePermissions, normalizeShopData, getEffectiveOfferStatus, generateDefaultTerms } from '../utils/helpers';
import { toast } from 'sonner';
import CashbackTable from '../components/cashback/CashbackTable';
import CashbackFormPage from '../components/cashback/CashbackForm';
import ConfirmModal from '../components/common/ConfirmModal';

const INITIAL_FORM_DATA = {
    shopId: '',
    title: '',
    status: 'ACTIVE',
    cashbackType: 'PERCENTAGE',
    cashbackValue: '',
    cashbackCreditDays: '',
    startDate: '',
    endDate: '',
    termsText: generateDefaultTerms(),
};

export default function CashbackOffer({ user, mode }) {
    const { id: routeEditId } = useParams();
    const navigate = useNavigate();
    const { canRead: canReadOffer, canWrite: canWriteOffer, canEdit: canEditOffer } = getModulePermissions(user, 'cashbackOffer');

    const isFormView = mode === 'create' || Boolean(routeEditId);

    const [shops, setShops] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [deleteModalOffer, setDeleteModalOffer] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const fetchStores = useCallback(async () => {
        try {
            const res = await apiService.getStores();
            if (res?.success && Array.isArray(res.shops)) {
                const normalized = res.shops.map(normalizeShopData);
                setShops(normalized);
                if (normalized.length > 0) {
                    setFormData((prev) => (prev.shopId ? prev : { ...prev, shopId: normalized[0].id }));
                }
            }
        } catch (err) {
            console.warn('Failed to fetch store directory:', err?.message);
        }
    }, []);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiService.getCashbackOffers();
            if (res?.success && Array.isArray(res.data)) {
                const processed = res.data.map((o) => ({
                    ...o,
                    status: o.endDate ? getEffectiveOfferStatus(o.endDate, o.status) : o.status,
                }));
                setOffers(processed);
            } else {
                setOffers([]);
            }
        } catch (err) {
            console.warn('Failed to load offers:', err?.message);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStores();
        fetchOffers();
    }, [fetchStores, fetchOffers]);

    useEffect(() => {
        if (routeEditId && offers.length > 0) {
            const existing = offers.find((o) => String(o.id) === String(routeEditId));
            if (existing) {
                let existingTermsText = '';
                if (Array.isArray(existing.termsAndConditions)) {
                    existingTermsText = `<ol>${existing.termsAndConditions.map((t) => `<li>${t}</li>`).join('')}</ol>`;
                } else if (typeof existing.termsAndConditions === 'string') {
                    existingTermsText = existing.termsAndConditions;
                }
                setFormData({
                    ...INITIAL_FORM_DATA,
                    ...existing,
                    shopId: existing.shopId || existing.shop?.id || '',
                    startDate: existing.startDate ? String(existing.startDate).split('T')[0] : '',
                    endDate: existing.endDate ? String(existing.endDate).split('T')[0] : '',
                    termsText: existingTermsText || generateDefaultTerms(existing),
                });
            }
        }
    }, [routeEditId, offers]);


    const handleCancelForm = useCallback(() => {
        navigate(appRoutesURL.cashbackOffer);
    }, [navigate]);

    const handleSaveOffer = useCallback(async (e) => {
        if (e) e.preventDefault();
        if (!formData.shopId) {
            toast.error('Please select a merchant store.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                status: formData.endDate ? getEffectiveOfferStatus(formData.endDate, formData.status) : formData.status,
                termsAndConditions: formData.termsText,
            };

            const res = routeEditId
                ? await apiService.updateCashbackOffer(routeEditId, payload)
                : await apiService.createCashbackOffer(payload);

            if (res?.success) {
                toast.success(`Cashback offer ${routeEditId ? 'updated' : 'created'} successfully!`);
                handleCancelForm();
                fetchOffers();
            } else {
                toast.error(res?.message || 'Failed to save offer.');
            }
        } catch (err) {
            toast.error(err?.message || 'An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    }, [formData, routeEditId, fetchOffers, handleCancelForm]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteModalOffer) return;
        setDeleting(true);
        try {
            const res = await apiService.deleteCashbackOffer(deleteModalOffer.id);
            if (res?.success) {
                toast.success('Cashback offer deleted.');
                setOffers((prev) => prev.filter((o) => o.id !== deleteModalOffer.id));
                setDeleteModalOffer(null);
            } else {
                toast.error(res?.message || 'Failed to delete offer.');
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to delete offer.');
        } finally {
            setDeleting(false);
        }
    }, [deleteModalOffer]);

    const handleAddOffer = useCallback(() => {
        setFormData({
            ...INITIAL_FORM_DATA,
            shopId: shops[0]?.id || '',
        });
        navigate(`${appRoutesURL.cashbackOfferCreate}?step=1`);
    }, [shops, navigate]);

    const handleEditOffer = useCallback((offer) => {
        navigate(`${appRoutesURL.cashbackOffer}/edit/${offer.id}`);
    }, [navigate]);

    const handleDeleteOffer = useCallback((offer) => {
        setDeleteModalOffer(offer);
    }, []);

    const filteredOffers = useMemo(() => {
        if (!search) return offers;
        const q = search.toLowerCase();
        return offers.filter((o) => {
            const shopName = o.shop?.name || '';
            const title = o.title || '';
            return title.toLowerCase().includes(q) || shopName.toLowerCase().includes(q);
        });
    }, [offers, search]);

    return (
        <>
            {isFormView ? (
                <CashbackFormPage
                    isEditing={Boolean(routeEditId)}
                    shops={shops}
                    formData={formData}
                    onFormChange={setFormData}
                    onSubmit={handleSaveOffer}
                    onCancel={handleCancelForm}
                    saving={saving}
                    canWrite={canWriteOffer}
                    canEdit={canEditOffer}
                />
            ) : (
                <CashbackTable
                    offers={filteredOffers}
                    loading={loading}
                    canWrite={canWriteOffer}
                    canEdit={canEditOffer}
                    search={search}
                    onSearchChange={setSearch}
                    onAddOffer={handleAddOffer}
                    onEditOffer={handleEditOffer}
                    onDeleteOffer={handleDeleteOffer}
                />
            )}

            <ConfirmModal
                open={Boolean(deleteModalOffer)}
                onClose={() => setDeleteModalOffer(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Cashback Offer"
                itemName={deleteModalOffer?.title}
                itemType="cashback offer"
                confirmText="Delete"
                variant="destructive"
                compact
                loading={deleting}
            />
        </>
    );
}
