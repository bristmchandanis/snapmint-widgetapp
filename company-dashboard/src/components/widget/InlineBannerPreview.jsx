import React from 'react';
import '../../styles/inlineWidget.css';
import { DEFAULT_INLINE_CONFIG } from '../../utils/moduleData';
import SingleRowButton from './layouts/SingleRowButton';
import SingleRowLink from './layouts/SingleRowLink';
import TwoRowButton from './layouts/TwoRowButton';
import MinimalPill from './layouts/MinimalPill';

const LAYOUTS = {
  singleRowLink: SingleRowLink,
  twoRowButton: TwoRowButton,
  minimalPill: MinimalPill,
  singleRowButton: SingleRowButton,
};

export default function InlineBannerPreview(rawProps) {
  const { compact = false, type: customType, samplePrice: customSamplePrice, ...restProps } = rawProps;
  const config = { ...DEFAULT_INLINE_CONFIG, ...restProps };
  const LayoutComponent = LAYOUTS[config.layoutType] || SingleRowButton;

  const samplePrice = customSamplePrice || '₹499';
  const tenureType = customType || '2/4';

  return (
    <div className={`w-full flex flex-col items-center justify-center transition-all ${compact ? 'p-1 bg-transparent' : 'p-4 bg-white rounded-xl min-h-60'}`}>
      <div className="w-full max-w-lg">
        <LayoutComponent samplePrice={samplePrice} type={tenureType} {...config} />
      </div>
    </div>
  );
}
