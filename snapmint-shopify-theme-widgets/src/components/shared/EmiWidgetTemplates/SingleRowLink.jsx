import React from "react";
import { moneyFormat, snapmintLogo } from "../../../utils/constants";

const SingleRowLink = ({price, defaultEmiData, dynamicTenures, handleOpenPopup, applicablePlans, widgetConfig, widgetColor}) => {
  const {ctaText, isBranding, isDiscountBadge, isNewBadge, isUpiBranding, newBadgeText, pricePrefixText, priceText, secondaryEmiText, secondaryEmiOptionText, emiOptionText, discountBadgeText} = widgetConfig.inlineWidgetConfig;
  const {ctaColor,  discountBadgeTextColor, discountBadgeBgColor, emiOptionTextColor, newBadgeBgColor, newBadgeTextColor, pricePrefixTextColor, priceTextColor, secondaryEmiTextColor, secondaryEmiOptionTextColor, widgetBgColor} = widgetColor;
  const downPayment = moneyFormat(defaultEmiData.downPayment);
  const tenures = dynamicTenures;
  return (
    <div className="snp-widget-wrapper" data-price={price}>
      <div className="snp-widget" style={{background: widgetBgColor}}>
        {isNewBadge || isDiscountBadge ?
            <div className="snp-offer-badge">
              {
                isNewBadge ? <span className="snp-offer-new" style={{color: newBadgeTextColor, background: newBadgeBgColor}}>{newBadgeText}</span> : ""
              }
              {
                isDiscountBadge ? <span className="snp-offer-text" style={{color: discountBadgeTextColor, background: discountBadgeBgColor}}>{discountBadgeText}</span> : ""
              }
            </div> : null
        }

        {
          applicablePlans.length > 1 ?
              <div className="snp-main-content">
                <span className="snp-price snp-divider" style={{color: priceTextColor}}>{priceText.replace("{price}", downPayment)}</span>
                <span className="snp-description" style={{color: emiOptionTextColor}}>{emiOptionText.replace("{tenure}", tenures)} {isBranding ? snapmintLogo : ""}</span>
              </div> :
              <div className="snp-main-content snp-with-prefix">
                {pricePrefixText ? <span className="snp-price-prefix" style={{color: pricePrefixTextColor}}>{pricePrefixText}</span> : ""}
                <span className="snp-price" style={{color: priceTextColor}}>{downPayment}</span>
                {
                  isUpiBranding ? <span className="snp-description" style={{color: secondaryEmiOptionTextColor}}>{priceText.replace("{price}", "")} {secondaryEmiOptionText.replace("{tenure}", dynamicTenures)} <span className='snp-emi-on-upi' style={{color: secondaryEmiTextColor}}>{secondaryEmiText.replace("{percentage}", "0")} on UPI</span></span> : <span className="snp-description" style={{color: emiOptionTextColor}}>{priceText.replace("{price}", "")} {secondryEmiOptionText.replace("{tenure}", dynamicTenures)} {snapmintLogo}</span>
                }
              </div>
        }
        <button type="button" className="snp-cta-link" onClick={handleOpenPopup} data-price={price} style={{color: ctaColor}}>
          <div className="snp-cta-link-btn">
            <span> {ctaText}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clipPath="url(#clip0_28_24235)">
                <path
                  d="M6.16597 4.16597C6.38727 3.94468 6.74546 3.94468 6.96675 4.16597L10.3001 7.49931C10.5214 7.7206 10.5214 8.07879 10.3001 8.30009C10.0788 8.52138 9.7206 8.52138 9.49931 8.30009L6.16597 4.96675C5.94468 4.74546 5.94468 4.38727 6.16597 4.16597Z"
                  fill="#151E29"
                />
                <path
                  d="M10.3001 7.49931C10.0788 7.27801 9.7206 7.27801 9.49931 7.49931L6.16597 10.8326C5.94468 11.0539 5.94468 11.4121 6.16597 11.6334C6.38727 11.8547 6.74546 11.8547 6.96675 11.6334L10.3001 8.30009C10.5214 8.07879 10.5214 7.7206 10.3001 7.49931Z"
                  fill="#151E29"
                />
              </g>
              <defs>
                <clipPath id="clip0_28_24235">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SingleRowLink;
