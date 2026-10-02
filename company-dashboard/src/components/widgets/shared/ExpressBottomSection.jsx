import React, { useState, useEffect, useMemo, memo } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';

const INPUT_FIELDS = [
  { placeholder: 'Full Name', type: 'text' },
  { placeholder: 'Last Name', type: 'text' },
  { placeholder: '+91 Mobile No.', type: 'tel' },
];

const SIZE_OPTIONS = ['9', '10'];
const COLOR_OPTIONS = ['Brown', 'Black'];

// Shared Segment Tab Selector for sidebar customization
export const ExpressBottomTabSelector = memo(function ExpressBottomTabSelector({
  activeTab = 'size',
  onTabChange,
}) {
  return (
    <div className="bg-[#f1f5f9] p-1 rounded-lg flex gap-1 mb-3">
      <button
        type="button"
        onClick={() => onTabChange?.('size')}
        className={`flex-1 py-1.5 px-3 text-xs font-semibold text-center rounded-md transition-all cursor-pointer ${
          activeTab === 'size'
            ? 'bg-white text-gray-900 shadow-xs'
            : 'text-gray-500 hover:text-gray-700 bg-transparent'
        }`}
      >
        Size & colour
      </button>
      <button
        type="button"
        onClick={() => onTabChange?.('name')}
        className={`flex-1 py-1.5 px-3 text-xs font-semibold text-center rounded-md transition-all cursor-pointer ${
          activeTab === 'name'
            ? 'bg-white text-gray-900 shadow-xs'
            : 'text-gray-500 hover:text-gray-700 bg-transparent'
        }`}
      >
        Name & mobile
      </button>
    </div>
  );
});

// Reusable "Buy On EMI >" CTA button
export const BuyButton = memo(function BuyButton({ onClick }) {
  return (
    <button type="button" className="snp-express-btn" onClick={onClick}>
      <span>Buy On EMI</span>
      <span>&gt;</span>
    </button>
  );
});

// Standard styled select field (browser natively opens upwards near viewport bottom)
const SelectField = memo(function SelectField({ placeholder, options, value, onChange }) {
  return (
    <div className="relative w-full">
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="snp-express-select"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '14px',
          height: '14px',
          color: '#334255',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

export const ExpressBottomSection = memo(function ExpressBottomSection({
  merchantName = "Neeman's",
  expressTab = 'name',
  onTabChange,
  customText = {},
  onBuy,
}) {
  const [activeTab, setActiveTab] = useState(expressTab);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Brown');

  useEffect(() => {
    if (expressTab) setActiveTab(expressTab);
  }, [expressTab]);

  const toggleTab = () => {
    const nextTab = activeTab === 'name' ? 'size' : 'name';
    setActiveTab(nextTab);
    onTabChange?.(nextTab);
  };

  const sizeSheetTitle = useMemo(() => {
    const raw = customText?.sizeSheetTitle !== undefined
      ? customText.sizeSheetTitle
      : 'Choose Size for {merchant} EMI Purchase';
    return raw.includes('{merchant}')
      ? raw.replace('{merchant}', merchantName)
      : (raw || `Choose Size for ${merchantName} EMI Purchase`);
  }, [customText?.sizeSheetTitle, merchantName]);

  return (
    <div className="snp-express-section" data-snp-el="express-bottom">
      {activeTab === 'name' ? (
        /* View 1: Name & Mobile Checkout Form */
        <div>
          <div
            onClick={toggleTab}
            title="Click to preview Size selection"
            className="snp-express-title mb-2.5"
          >
            Pay with {merchantName} at 0% EMI
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {INPUT_FIELDS.map((field) => (
              <Input
                key={field.placeholder}
                type={field.type}
                placeholder={field.placeholder}
                className="snp-express-input"
              />
            ))}
            <BuyButton onClick={onBuy} />
          </div>
        </div>
      ) : (
        /* View 2: Size & Color Variant Selector Sheet */
        <div>
          <div
            onClick={toggleTab}
            title="Click to preview Name & Mobile form"
            className="snp-express-title mb-1"
          >
            {sizeSheetTitle}
          </div>

          <div
            onClick={toggleTab}
            style={{
              fontSize: '11px',
              fontStyle: 'italic',
              color: '#64748B',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span>Color: {selectedColor || 'Brown'}</span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Size: {selectedSize || '—'}
              <Pencil style={{ width: '11px', height: '11px', opacity: 0.7 }} />
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <SelectField
              placeholder="Select Size"
              options={SIZE_OPTIONS}
              value={selectedSize}
              onChange={setSelectedSize}
            />
            <SelectField
              placeholder="Select Color"
              options={COLOR_OPTIONS}
              value={selectedColor}
              onChange={setSelectedColor}
            />
          </div>

          <BuyButton onClick={onBuy} />
        </div>
      )}
    </div>
  );
});

export default ExpressBottomSection;
