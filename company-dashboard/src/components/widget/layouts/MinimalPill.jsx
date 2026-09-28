import React from 'react';
import '../../../styles/inlineWidget.css';
import { snapmintLogo } from '../../common/SnapmintLogo';
import { formatLayoutProps } from '../../../utils/widgetHelpers';

export default function MinimalPillLayout(props) {
  const {
    widgetBgColor,
    widgetBorderColor,
    prefix,
    pricePrefixTextColor,
    priceDisplay: price,
    priceTextColor,
    emiText,
    emiOptionTextColor,
    showBranding: showSnapmint,
    infoTooltipText,
    infoTooltipTextColor,
  } = formatLayoutProps(props);

  const iconColor = infoTooltipTextColor && !['#ffffff', '#fff'].includes(infoTooltipTextColor.toLowerCase())
    ? infoTooltipTextColor
    : '#151E29';

  const showInfoIcon = props.isInfoIcon !== false;

  return (
    <div className="snp-widget-minimal-wrapper">
      <div
        className="snp-minimal-widget"
        aria-label="Snapmint EMI payment offer"
        style={{
          borderColor: widgetBorderColor || '#D71E09',
        }}
      >
        <div className="snp-minimal-main-content">
          <div className="snp-minimal-price-container">
            {prefix && (
              <span className="snp-minimal-price-prefix" style={{ color: pricePrefixTextColor }}>
                {prefix}
              </span>
            )}
            <span className="snp-minimal-price" style={{ color: priceTextColor }}>
              {price}
            </span>
          </div>

          <span className="snp-minimal-description" style={{ color: emiOptionTextColor }}>
            {emiText}
          </span>

          <div className="snp-minimal-branding">
            {showSnapmint && snapmintLogo}
            {showInfoIcon && (
              <div className="relative group/tooltip inline-flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ cursor: 'pointer', marginLeft: '4px' }}
                >
                  <g clipPath="url(#clip0_35_314107)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 14.5 8ZM7.30404 7.03906C8.06816 6.657 8.92845 7.34699 8.72135 8.17578L8.2487 10.0664L8.27669 10.0527C8.52363 9.92944 8.82381 10.0298 8.94727 10.2767C9.07056 10.5236 8.97021 10.8238 8.72331 10.9473L8.69596 10.9609C7.93184 11.343 7.07155 10.653 7.27865 9.82422L7.7513 7.93359L7.72331 7.94727C7.47637 8.07056 7.17619 7.97021 7.05273 7.72331C6.92944 7.47637 7.02979 7.17619 7.27669 7.03906ZM8.00521 5C8.28126 5.00011 8.50521 5.22393 8.50521 5.5V5.50521C8.5051 5.78119 8.28119 6.0051 8.00521 6.00521H8C7.72393 6.00521 7.50011 5.78126 7.5 5.50521V5.5C7.5 5.22386 7.72386 5 8 5H8.00521ZM14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z"
                      fill={iconColor}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_35_314107">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                {/* Clean, light, minimal hover tooltip popover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50 whitespace-nowrap bg-white text-gray-800 text-[11px] font-normal leading-tight px-2.5 py-1 rounded-md border border-gray-200 shadow-md pointer-events-none transition-all duration-150">
                  {infoTooltipText || 'Calculate EMI options'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
