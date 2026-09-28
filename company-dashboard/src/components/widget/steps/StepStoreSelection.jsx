import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconChevronDown, IconCheck, IconSearch, IconCheckCircle2, IconAlertCircle } from '../../common/Icons';
import { isShopApproved } from '@/utils/helpers';
import StepNavigation from '../../common/StepNavigation';

export default function StepStoreSelection({ shops = [], selectedShop, onSelectShop, onNext, disabled = false }) {
  const [storeSearch, setStoreSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredShops = useMemo(() => {
    if (!storeSearch.trim()) return shops;
    const query = storeSearch.toLowerCase();
    return shops.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.myshopifyDomain && s.myshopifyDomain.toLowerCase().includes(query))
    );
  }, [shops, storeSearch]);

  const isApproved = Boolean(selectedShop && isShopApproved(selectedShop.onboardStatus || selectedShop.onboard_status));

  return (
    <Card className="w-full rounded-xl border border-gray-200/90 shadow-2xs bg-white">
      {/* Clean Header Bar */}
      <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
        <div>
          <CardTitle className="text-sm font-semibold text-gray-900 tracking-tight">
            Select Store
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Searchable Store Selection Field */}
        <div className="space-y-2 relative" ref={dropdownRef}>
          <Label className="text-sm font-semibold text-gray-800 block">
            Target Store
          </Label>

          <div className="relative">
            <div
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`w-full border rounded-xl px-4 py-3 min-h-[46px] flex items-center justify-between transition-all text-sm font-medium text-gray-900 shadow-2xs ${disabled ? 'bg-gray-50/80 border-gray-200 cursor-not-allowed text-gray-700' : 'bg-white hover:bg-gray-50/50 border-gray-200 cursor-pointer'}`}
            >
              {selectedShop ? (
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-gray-900 text-sm">{selectedShop.name || selectedShop.myshopifyDomain}</span>
                  <span className="text-gray-400 font-mono text-xs">({selectedShop.myshopifyDomain})</span>
                </div>
              ) : (
                <span className="text-gray-400 font-normal text-sm">-- Select Store --</span>
              )}
              <IconChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2.5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
                  <IconSearch className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search store by name or domain..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="text-sm bg-white h-9 border-gray-200 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => {
                          onSelectShop(shop);
                          setIsOpen(false);
                        }}
                        className={`p-3 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedShop?.id === shop.id ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-700'
                          }`}
                      >
                        <span className="truncate">
                          <strong className="font-semibold">{shop.name || shop.myshopifyDomain}</strong>{' '}
                          <span className="text-gray-400 font-mono text-xs">({shop.myshopifyDomain})</span>
                        </span>
                        {selectedShop?.id === shop.id && (
                          <IconCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-6 px-4 text-sm text-center text-gray-500 bg-gray-50/50 flex flex-col items-center justify-center gap-1">
                      <span className="font-medium text-gray-700">No matching stores found.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Store Status Info */}
        {selectedShop && (
          isApproved ? (
            <div className="px-3 py-2 rounded-lg border border-emerald-200/70 bg-emerald-50/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <IconCheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-950 text-[11px] font-medium truncate">
                  Active Store: <strong className="font-semibold">{selectedShop.name || selectedShop.myshopifyDomain}</strong>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shrink-0">
                Approved
              </span>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-lg border border-amber-200/80 bg-amber-50/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <IconAlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-amber-950 text-[11px] font-medium truncate">
                  Your onboarding is pending. Please complete onboarding first.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 shrink-0 uppercase">
                Pending
              </span>
            </div>
          )
        )}

        {/* Bottom Action Row */}
        <StepNavigation
          onNext={onNext}
          nextDisabled={!selectedShop || (!isApproved && !disabled)}
        />
      </CardContent>
    </Card>
  );
}
