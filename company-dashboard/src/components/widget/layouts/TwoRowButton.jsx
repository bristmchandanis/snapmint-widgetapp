import React from 'react';
import '../../../styles/inlineWidget.css';
import { snapmintLogo } from '../../common/SnapmintLogo';
import { formatLayoutProps } from '../../../utils/widgetHelpers';

export default function TwoRowButtonLayout(props) {
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
    secondaryEmiOptionTextColor,
    emiOptionTextColor,
    type,
    isSingle,
    secondary,
    showUpi,
    showBranding: showSnapmint,
    secondaryEmiTextColor,
    ctaText,
    ctaColor,
    ctaBgColor,
    secondaryEmiOptionText,
    emiOptionText,
  } = formatLayoutProps(props);

  const showSecondRow = showUpi || showSnapmint || Boolean(secondary);

  return (
    <div className="snp-widget-wrapper">
      <div
        className="snp-widget snp-widget-two"
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

        <div>
          {isSingle ? (
            <div className={`snp-main-content ${prefix ? 'snp-with-prefix' : ''}`}>
              {prefix && <span className="snp-price-prefix" style={{ color: pricePrefixTextColor }}>{prefix}</span>}
              <span className="snp-price" style={{ color: priceTextColor }}>{priceDisplay}</span>
              <span className="snp-description" style={{ color: secondaryEmiOptionTextColor || emiOptionTextColor }}>
                {(secondaryEmiOptionText || '({tenure} months)').replace('{tenure}', type)}
              </span>
            </div>
          ) : (
            <div className="snp-main-content">
              <span className="snp-price" style={{ color: priceTextColor }}>{priceDisplay}</span>
              <span className="snp-description" style={{ color: emiOptionTextColor }}>
                {(emiOptionText || '{tenure} months EMI options').replace('{tenure}', type || '2/4')}
              </span>
            </div>
          )}

          {showSecondRow && (
            <div className="snp-main-content snp-main-content-two">
              {showUpi && (
                <>
                  <span className="snp-emi" style={{ color: secondaryEmiTextColor }}>
                    {secondary || '0% EMI'}
                  </span>
                  {!secondary && <span className="snp-emi-on">on</span>}
                  <div className={`snp-upi ${showSnapmint ? 'snp-divider' : ''}`}>
                    <svg width="34" height="10" viewBox="0 0 34 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25.6052 8.99526H23.8091L26.3055 0H28.0904L25.6052 8.99526Z" fill="#787878" />
                      <path d="M24.6647 0.310252C24.5405 0.138548 24.3484 0.0527344 24.0886 0.0527344H14.2383L13.7525 1.81385H15.5485L22.7105 1.81268L22.1908 3.69577H15.0177L15.029 3.69128H13.2329L11.7417 9.05813H13.5379L14.532 5.45688H22.5861C22.8459 5.45688 23.0832 5.371 23.2978 5.1993C23.5237 5.02759 23.6706 4.81526 23.7384 4.56222L24.7438 0.959803C24.8115 0.697729 24.789 0.480826 24.6647 0.310252Z" fill="#787878" />
                      <path d="M10.7126 8.46057C10.6109 8.8164 10.2833 9.06268 9.92179 9.06268H0.681492C0.421677 9.06268 0.240937 8.97684 0.116677 8.80627C-0.00758218 8.63456 -0.030252 8.42216 0.0375258 8.16913L2.28548 0.0527344H4.08169L2.07092 7.30163H9.24404L11.2548 0.0527344H13.0396L10.7126 8.46057Z" fill="#787878" />
                      <path d="M31.1895 0.0429688L33.4488 4.55246L28.6816 9.05967L31.1895 0.0429688Z" fill="#27803B" />
                      <path d="M29.596 0.0429688L31.8666 4.55246L27.0996 9.05967L29.596 0.0429688Z" fill="#E9661C" />
                    </svg>
                  </div>
                </>
              )}
              {(!showUpi || showSnapmint) && snapmintLogo}
            </div>
          )}
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
