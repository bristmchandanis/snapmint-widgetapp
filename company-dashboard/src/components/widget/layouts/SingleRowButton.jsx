import React from 'react';
import '../../../styles/inlineWidget.css';
import { snapmintLogo } from '../../common/SnapmintLogo';
import { formatLayoutProps } from '../../../utils/widgetHelpers';

export default function SingleRowButton(props) {
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
    ctaBgColor,
  } = formatLayoutProps(props);

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
          <button type="button" className="snp-cta" style={{ backgroundColor: ctaBgColor || '#EF0714', color: ctaColor || '#FFFFFF' }}>
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
}
