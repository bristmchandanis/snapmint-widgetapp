import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cleanShopDomain, validateMerchantForm } from '../../validation/merchantValidation';
import { IconArrowRight } from '../common/Icons';
import FormField from '../common/FormField';
import snapmintImg from '../../assets/images/branding/snapmint.svg';
import cobrandedImg from '../../assets/images/branding/cobranded.svg';
import whitelabelImg from '../../assets/images/branding/whitelabel.svg';

const BRANDING_MODES = [
  {
    id: 'snapmint',
    title: 'Snapmint',
    img: snapmintImg,
    description: 'Snapmint logo, colours and fonts. Ready to use.',
  },
  {
    id: 'co-branded',
    title: 'Co-branded',
    img: cobrandedImg,
    description: 'Your brand with Snapmint. Custom colours, fonts and corners.',
  },
  {
    id: 'white-label',
    title: 'White label',
    img: whitelabelImg,
    description: 'Your logo and Identity. Custom colours, fonts and corners.',
  },
];

const MERCHANT_FIELDS = [
  {
    id: 'merchant-name',
    name: 'name',
    label: 'Merchant name',
    placeholder: "e.g. Neeman's",
    colSpan: 'sm:col-span-1',
  },
  {
    id: 'merchant-id',
    name: 'merchantId',
    label: 'Merchant ID (MID)',
    placeholder: 'e.g. SNP-10432',
    className: 'font-mono uppercase',
    colSpan: 'sm:col-span-1',
  },
  {
    id: 'store-url',
    name: 'shop',
    label: 'Shopify store URL',
    placeholder: 'your-store.myshopify.com',
    hint: "Paste the store's .myshopify.com address, with or without https://.",
    className: 'font-mono',
    colSpan: 'sm:col-span-2',
  },
];

export default function AddMerchant({ onSuccess, disabled = false, initialData = {}, isEdit = false }) {
  const [formData, setFormData] = useState(() => ({
    name: initialData.name || '',
    merchantId: initialData.merchantId || '',
    shop: initialData.shop || '',
    brandingMode: initialData.brandingMode || 'snapmint',
  }));

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateMerchantForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const sanitizedShop = cleanShopDomain(formData.shop);
    const trimmedMerchantId = formData.merchantId.trim();

    const merchantData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      shop: sanitizedShop,
      merchantId: trimmedMerchantId,
      brandingMode: formData.brandingMode,
    };

    if (onSuccess) {
      onSuccess(merchantData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {isEdit || initialData?.id ? 'Edit merchant' : 'Add merchant'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Card className="rounded-2xl border border-gray-200/80 shadow-xs bg-white p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Merchant details
            </h2>
            <p className="text-xs text-gray-500 font-normal mt-1">
              Use the merchant's existing ID and Shopify store address.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {MERCHANT_FIELDS.map((field) => (
              <div key={field.id} className={field.colSpan}>
                <FormField
                  id={field.id}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  hint={field.hint}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className={field.className}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-200/80 shadow-xs bg-white p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Choose the branding mode
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {BRANDING_MODES.map((mode) => {
              const isSelected = formData.brandingMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => handleInputChange('brandingMode', mode.id)}
                  className={`rounded-2xl border p-3.5 sm:p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${isSelected
                    ? 'border-black bg-gray-50/40 ring-1 ring-black'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center h-16 sm:h-18">
                    <img src={mode.img} alt={mode.title} className="h-full w-auto object-contain mx-auto" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900">{mode.title}</h3>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-black bg-white ring-2 ring-black/10' : 'border-gray-300 bg-white'
                          }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={disabled || submitting}
            className="rounded-md h-9 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{submitting ? 'Saving...' : (isEdit || initialData?.id ? 'Continue' : 'Add merchant')}</span>
            <IconArrowRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
}

