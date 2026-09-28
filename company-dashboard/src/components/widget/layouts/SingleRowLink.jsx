import React from 'react';
import '../../../styles/inlineWidget.css';
import { snapmintLogo } from '../../common/SnapmintLogo';
import { formatLayoutProps } from '../../../utils/widgetHelpers';

export default function SingleRowLink(props) {
  const {
    widgetBgColor,
    showNewBadge,
    newBadgeText,
    newBadgeTextColor,
    newBadgeBgColor,
    showDiscountBadge,
    discountBadgeText,
    discountBadgeTextColor,
    discountBadgeBgColor,
    prefix,
    pricePrefixTextColor,
    priceDisplay,
    priceTextColor,
    emiText,
    emiColor,
    secondary,
    upiText,
    secondaryEmiTextColor,
    showBranding,
    ctaText,
    ctaColor,
  } = formatLayoutProps(props);

  const linkColor = ctaColor && typeof ctaColor === 'string' && !['#ffffff', '#fff', '#ef0714'].includes(ctaColor.toLowerCase())
    ? ctaColor
    : '#151E29';

  return (
    <div className="snp-widget-wrapper">
      <div
        className="snp-widget"
        style={{
          backgroundColor: widgetBgColor || '#EFEFEF',
        }}
      >
        {(showNewBadge || showDiscountBadge) && (
          <div className="snp-offer-badge">
            {showNewBadge && (
              <span className="snp-offer-new" style={{ backgroundColor: newBadgeBgColor, color: newBadgeTextColor }}>
                {newBadgeText}
              </span>
            )}
            {showDiscountBadge && (
              <span className="snp-offer-text" style={{ backgroundColor: discountBadgeBgColor, color: discountBadgeTextColor }}>
                {discountBadgeText}
              </span>
            )}
          </div>
        )}

        <div className={`snp-main-content ${prefix ? 'snp-with-prefix' : ''}`}>
          {prefix && (
            <span className="snp-price-prefix" style={{ color: pricePrefixTextColor }}>
              {prefix}
            </span>
          )}

          <span className={`snp-price ${!prefix ? 'snp-divider' : ''}`} style={{ color: priceTextColor }}>
            {priceDisplay}
          </span>

          <span className="snp-description" style={{ color: emiColor }}>
            {emiText}
            {upiText ? (
              <>
                {secondary && <span className="font-normal"> at </span>}
                <span className="snp-secondary-text font-bold whitespace-nowrap ml-0.5" style={{ color: secondaryEmiTextColor }}>
                  {upiText}
                </span>
              </>
            ) : (
              <> {' by '}{snapmintLogo}</>
            )}
          </span>
        </div>

        {ctaText && (
          <button type="button" className="snp-cta-link" style={{ color: linkColor }}>
            <div className="snp-cta-link-btn">
              <span className="snp-cta-link-text">{ctaText}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_28_24235)">
                  <path d="M6.16597 4.16597C6.38727 3.94468 6.74546 3.94468 6.96675 4.16597L10.3001 7.49931C10.5214 7.7206 10.5214 8.07879 10.3001 8.30009C10.0788 8.52138 9.7206 8.52138 9.49931 8.30009L6.16597 4.96675C5.94468 4.74546 5.94468 4.38727 6.16597 4.16597Z" fill="currentColor" />
                  <path d="M10.3001 7.49931C10.0788 7.27801 9.7206 7.27801 9.49931 7.49931L6.16597 10.8326C5.94468 11.0539 5.94468 11.4121 6.16597 11.6334C6.38727 11.8547 6.74546 11.8547 6.96675 11.6334L10.3001 8.30009C10.0788 8.07879 10.5214 7.7206 10.3001 7.49931Z" fill="currentColor" />
                </g>
                <defs><clipPath id="clip0_28_24235"><rect width="16" height="16" fill="white" /></clipPath></defs>
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
