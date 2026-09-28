import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../utils/constants';
import { formatDate, getModulePermissions } from '../utils/helpers';
import AddMerchant from '../components/modals/AddMerchant';
import Filter from '../components/common/Filter';
import DataTable from '../components/common/DataTable';
import ConfirmModal from '../components/common/ConfirmModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { IconBuilding, IconPencil, IconTrash, IconRefresh, IconEye } from '../components/common/Icons';
import { appRoutesURL } from '../routes/appRoutesURL';
import { cn } from '@/lib/utils';

export default function MerchantOnboard({ user, mode }) {
  const navigate = useNavigate();
  const { editId: routeEditId, deleteId: routeDeleteId } = useParams();

  const { canWrite, canEdit } = getModulePermissions(user, 'merchantOnboard');

  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMerchantId, setDeletingMerchantId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshingId, setRefreshingId] = useState(null);

  const handleRefreshRow = async (merchant) => {
    const rowId = merchant.id || merchant.shop;
    setRefreshingId(rowId);
    try {
      const res = await apiService.updateMerchantCredential({
        id: merchant.id,
        shop: merchant.shop,
        merchantId: merchant.merchantId || merchant.mid,
        token: merchant.token,
      });
      if (res?.success) {
        toast.success(`Metafield synced to Shopify for ${merchant.shop}`);
      } else {
        toast.error(res?.message || 'Failed to sync Shopify metafield.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to connect to server.');
    } finally {
      setRefreshingId(null);
    }
  };

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
    } else if (routeDeleteId) {
      setDeleteModalOpen(true);
    } else {
      setAddModalOpen(false);
      setEditModalOpen(false);
      setDeleteModalOpen(false);
    }
  }, [mode, routeEditId, routeDeleteId, merchants]);

  const handleCloseModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setEditingMerchant(null);
    setDeletingMerchantId(null);
    navigate(appRoutesURL.merchantOnboard);
  };

  const filteredMerchants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return merchants;
    return merchants.filter(
      (merchant) =>
        (merchant.shop && merchant.shop.toLowerCase().includes(query)) ||
        (merchant.merchantId && merchant.merchantId.toLowerCase().includes(query)) ||
        (merchant.mid && merchant.mid.toLowerCase().includes(query)) ||
        (merchant.token && merchant.token.toLowerCase().includes(query))
    );
  }, [merchants, search]);

  const handleOpenAddModal = () => {
    setEditingMerchant(null);
    setAddModalOpen(true);
    navigate(`${appRoutesURL.merchantOnboard}/create`);
  };

  const handleOpenEditModal = (merchant) => {
    setEditingMerchant(merchant);
    setEditModalOpen(true);
    if (merchant.id) {
      navigate(`${appRoutesURL.merchantOnboard}/edit/${merchant.id}`);
    }
  };

  const handlePromptDelete = (merchantId) => {
    setDeletingMerchantId(merchantId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const targetId = routeDeleteId || deletingMerchantId;
    if (!targetId) return;
    setDeleting(true);
    try {
      const res = await apiService.deleteMerchantCredential({ id: targetId });
      if (res?.success) {
        toast.success('Merchant credential deleted successfully.');
        setMerchants((prev) => prev.filter((merchant) => String(merchant.id) !== String(targetId)));
        handleCloseModals();
      } else {
        toast.error(res?.message || 'Failed to delete merchant credential.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to connect to server.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Merchant Onboarding
          </h1>
        </div>

        <Button
          size="sm"
          onClick={handleOpenAddModal}
          disabled={!canWrite}
          className="rounded-md px-4 font-bold shadow-2xs self-start sm:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Merchant
        </Button>
      </div>

      {/* Main Credentials Table Card */}
      <Card className="rounded-xl border border-gray-200 shadow-none overflow-hidden bg-white">
        <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-gray-700" />
                Registered Merchant Credentials
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
              'Merchant ID',
              'Snapmint Token',
              'App Status',
              'Created Date',
              { label: 'Actions', className: 'text-center' },
            ]}
            data={filteredMerchants}
            loading={loading}
            emptyMessage={search ? 'No matching records found.' : 'No Registered Merchants Yet.'}
            renderRow={(merchant) => (
              <TableRow key={merchant.id || merchant.shop}>
                <TableCell>
                  <div className="font-bold text-gray-900 text-sm">{merchant.shop}</div>
                </TableCell>

                <TableCell>
                  <div className="font-semibold text-gray-800 text-xs font-mono">{merchant.merchantId || merchant.mid || 'N/A'}</div>
                </TableCell>

                <TableCell>
                  <div className="text-gray-600 text-xs font-mono truncate max-w-48 bg-gray-100/70 border border-gray-200/60 px-2 py-1 rounded-md">
                    {merchant.token || 'N/A'}
                  </div>
                </TableCell>

                <TableCell>
                  {String(merchant.appInstall) === '1' ? (
                    <Badge variant="installed">Installed</Badge>
                  ) : (
                    <Badge variant="uninstalled">Uninstalled</Badge>
                  )}
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs font-medium text-gray-600">
                  {formatDate(merchant.createdAt || merchant.created_at)}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {canEdit && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleRefreshRow(merchant)}
                        disabled={refreshingId === (merchant.id || merchant.shop)}
                        title="Sync Shopify Metafield"
                        className="w-8 h-8 rounded-md border-gray-200 text-gray-700 bg-white hover:bg-gray-100 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconRefresh
                          className={cn(
                            "w-3.5 h-3.5 text-gray-700",
                            refreshingId === (merchant.id || merchant.shop) && "animate-spin text-gray-900"
                          )}
                        />
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      onClick={() => handleOpenEditModal(merchant)}
                      title={canEdit ? "Edit Merchant Credentials" : "View Merchant Credentials"}
                      className="w-8 h-8 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all cursor-pointer shadow-2xs"
                    >
                      {canEdit ? <IconPencil className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </Button>

                    {canEdit && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handlePromptDelete(merchant.id)}
                        title="Delete Merchant Credentials"
                        className="w-8 h-8 rounded-md text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                      >
                        <IconTrash className="w-4 h-4 text-rose-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent >
      </Card >

      <AddMerchant
        open={addModalOpen}
        disabled={!canWrite}
        onOpenChange={(open) => {
          if (!open) handleCloseModals();
          else setAddModalOpen(true);
        }}
        onMerchantAdded={() => {
          handleCloseModals();
          fetchMerchants();
        }}
      />

      <AddMerchant
        open={editModalOpen}
        disabled={!canEdit}
        readOnly={!canEdit}
        onOpenChange={(open) => {
          if (!open) handleCloseModals();
          else setEditModalOpen(true);
        }}
        initialData={editingMerchant}
        onMerchantAdded={() => {
          handleCloseModals();
          fetchMerchants();
        }}
      />

      <ConfirmModal
        open={deleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="Delete Merchant Credential"
        itemName={merchants.find((m) => String(m.id) === String(routeDeleteId || deletingMerchantId))?.shop}
        confirmText="Delete"
        variant="destructive"
        compact
        loading={deleting}
      />
    </div >
  );
}
