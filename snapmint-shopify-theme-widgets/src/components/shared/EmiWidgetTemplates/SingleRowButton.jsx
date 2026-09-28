import React from 'react';
import {moneyFormat, snapmintLogo} from "../../../utils/constants";
const SingleRowButton = ({price, defaultEmiData, dynamicTenures, handleOpenPopup, applicablePlans, widgetConfig, widgetColor}) => {
    const {ctaText, isBranding, isDiscountBadge, isNewBadge, isUpiBranding, newBadgeText, pricePrefixText, priceText, secondaryEmiText, secondaryEmiOptionText, emiOptionText, discountBadgeText} = widgetConfig.inlineWidgetConfig;
    const {ctaBgColor, ctaColor,  discountBadgeTextColor, discountBadgeBgColor, emiOptionTextColor, newBadgeBgColor, newBadgeTextColor, pricePrefixTextColor, priceTextColor, secondaryEmiTextColor, secondaryEmiOptionTextColor, widgetBgColor} = widgetColor;
    const downPayment = moneyFormat(defaultEmiData.downPayment);
    const tenures = dynamicTenures;
    return (
        <div className="snp-widget-wrapper" data-price={price} >
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
                <button type="button" style={{color: ctaColor, background: ctaBgColor}} className="snp-cta" onClick={handleOpenPopup} data-price={price}>
                    {ctaText}
                </button>
            </div>
        </div>
    );
};

export default SingleRowButton;