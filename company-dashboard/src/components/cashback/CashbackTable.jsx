import React, { memo, useCallback } from 'react';
import DataTable from '../common/DataTable';
import Filter from '../common/Filter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    IconTag,
    IconPencil,
    IconTrash,
    IconEye,
} from '../common/Icons';
import { formatDate, getEffectiveOfferStatus } from '../../utils/helpers';

const TABLE_HEADERS = [
    'Shop Domain',
    'Offer Title',
    'Cashback Amount',
    'Status',
    'Start & Expiry Date',
    { label: 'Actions', className: 'text-center' },
];

const CashbackTable = memo(function CashbackTable({
    offers = [],
    loading = false,
    canWrite = true,
    canEdit = true,
    search = '',
    onSearchChange,
    onAddOffer,
    onEditOffer,
    onDeleteOffer,
}) {
    const renderRow = useCallback(
        (offer) => {
            const currentStatus = getEffectiveOfferStatus(offer.endDate, offer.status);

            return (
                <TableRow key={offer.id}>
                    <TableCell className="whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm whitespace-nowrap">
                            {offer.shop?.myshopifyDomain || `Shop #${offer.shopId}`}
                        </div>
                        {offer.shop?.name && (
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {offer.shop.name}
                            </div>
                        )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs font-semibold text-gray-800">
                        {offer.title}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-center text-xs font-bold text-gray-900">
                        {offer.cashbackType === 'PERCENTAGE' ? `${offer.cashbackValue}%` : `₹${offer.cashbackValue}`}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                        <Badge variant={currentStatus === 'EXPIRED' ? 'expired' : 'active'} className="capitalize">
                            {currentStatus ? String(currentStatus).toLowerCase() : ''}
                        </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs font-medium text-gray-600">
                        <div className="space-y-0.5 whitespace-nowrap">
                            <div>
                                <span className="text-gray-400">Start:</span> {offer.startDate ? formatDate(offer.startDate) : 'Immediate'}
                            </div>
                            <div>
                                <span className="text-gray-400">Expires:</span> {offer.endDate ? formatDate(offer.endDate) : 'No Expiry'}
                            </div>
                        </div>
                    </TableCell>

                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => onEditOffer(offer)}
                                className="w-8 h-8 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-all cursor-pointer shadow-2xs"
                                title={canEdit ? "Edit Offer" : "View Offer"}
                            >
                                {canEdit ? <IconPencil className="w-4 h-4 text-white" /> : <IconEye className="w-4 h-4 text-white" />}
                            </Button>
                            {canEdit && (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onDeleteOffer(offer)}
                                    className="w-8 h-8 rounded-md border border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                                    title="Delete Offer"
                                >
                                    <IconTrash className="w-4 h-4 text-rose-600" />
                                </Button>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            );
        },
        [canEdit, onEditOffer, onDeleteOffer]
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Cashback & Offer
                </h1>

                <Button
                    size="sm"
                    onClick={onAddOffer}
                    disabled={!canWrite}
                    className="rounded-md px-4 font-bold shadow-2xs self-start sm:self-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Cashback
                </Button>
            </div>

            <Card className="rounded-xl border border-gray-200 shadow-none overflow-hidden bg-white">
                <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <IconTag className="w-4 h-4 text-gray-700" />
                            Configured Cashback Offers
                        </CardTitle>

                        <Filter
                            search={search}
                            onSearchChange={onSearchChange}
                            searchPlaceholder="Search records"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto w-full">
                    <DataTable
                        headers={TABLE_HEADERS}
                        data={offers}
                        loading={loading}
                        emptyMessage="No cashback offers configured yet."
                        renderRow={renderRow}
                    />
                </CardContent>
            </Card>
        </div>
    );
});

export default CashbackTable;
