import React from 'react';
import {moneyFormat, snapmintLogo} from "../../../utils/constants";

const TwoRowButton = ({price, defaultEmiData, dynamicTenures, handleOpenPopup, applicablePlans, widgetConfig, widgetColor}) => {
    const {ctaText, isBranding, isDiscountBadge, isNewBadge, isUpiBranding, newBadgeText, pricePrefixText, priceText, secondaryEmiText, secondaryEmiOptionText, emiOptionText, discountBadgeText} = widgetConfig.inlineWidgetConfig;
    const {ctaBgColor, ctaColor,  discountBadgeTextColor, discountBadgeBgColor, emiOptionTextColor, newBadgeBgColor, newBadgeTextColor, pricePrefixTextColor, priceTextColor, secondaryEmiTextColor, secondaryEmiOptionTextColor, widgetBgColor} = widgetColor;
    const downPayment = moneyFormat(defaultEmiData.downPayment);
    const tenures = dynamicTenures;
    return (
        <div className="snp-widget-wrapper" data-price={price}>
            <div className="snp-widget snp-widget-two" style={{background: widgetBgColor}}>
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
                <div>
                    {
                        applicablePlans.length > 1 ?
                            <div className="snp-main-content">
                                <span className="snp-price">{priceText.replace("{price}", downPayment)}</span>
                                <span className="snp-description">{dynamicTenures} months EMI options</span>
                            </div> :
                            <div className="snp-main-content snp-with-prefix">
                                <span className="snp-price-prefix">or</span>
                                <span className="snp-price">{defaultEmiData ? moneyFormat(defaultEmiData.downPayment) : ""}</span>
                                <span className="snp-description">/ month ({dynamicTenures} months)</span>
                            </div>
                    }
                    <div className="snp-main-content snp-main-content-two">
                        <span className="snp-emi">0% EMI</span>
                        <span className="snp-emi-on">on</span>
                        <div className="snp-upi snp-divider">
                            <svg width="34" height="10" viewBox="0 0 34 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.6052 8.99526H23.8091L26.3055 0H28.0904L25.6052 8.99526Z" fill="#787878"/>
                                <path d="M24.6647 0.310252C24.5405 0.138548 24.3484 0.0527344 24.0886 0.0527344H14.2383L13.7525 1.81385H15.5485L22.7105 1.81268L22.1908 3.69577H15.0177L15.029 3.69128H13.2329L11.7417 9.05813H13.5379L14.532 5.45688H22.5861C22.8459 5.45688 23.0832 5.371 23.2978 5.1993C23.5237 5.02759 23.6706 4.81526 23.7384 4.56222L24.7438 0.959803C24.8115 0.697729 24.789 0.480826 24.6647 0.310252Z" fill="#787878"/>
                                <path d="M10.7126 8.46057C10.6109 8.8164 10.2833 9.06268 9.92179 9.06268H0.681492C0.421677 9.06268 0.240937 8.97684 0.116677 8.80627C-0.00758218 8.63456 -0.030252 8.42216 0.0375258 8.16913L2.28548 0.0527344H4.08169L2.07092 7.30163H9.24404L11.2548 0.0527344H13.0396L10.7126 8.46057Z" fill="#787878"/>
                                <path d="M31.1895 0.0429688L33.4488 4.55246L28.6816 9.05967L31.1895 0.0429688Z" fill="#27803B"/>
                                <path d="M29.596 0.0429688L31.8666 4.55246L27.0996 9.05967L29.596 0.0429688Z" fill="#E9661C"/>
                            </svg>
                        </div>
                        {snapmintLogo}
                    </div>
                </div>


                <button
                    type="button"
                    className="snp-cta"
                    onClick={handleOpenPopup}
                    data-price={price}
                >
                    Buy On EMI
                </button>


            </div>
        </div>
    );
};

export default TwoRowButton;