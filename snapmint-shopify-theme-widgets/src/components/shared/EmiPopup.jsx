import React from "react";
import { getDownPaymentAndEmi } from "../../utils/emiCalculator";
import { moneyFormat } from "../../utils/constants";
import EmiPopupLayoutOne from "./templates/EmiPopupLayoutOne";
import EmiPopupLayoutTwo from "./templates/EmiPopupLayoutTwo";

const EmiPopup = ({ popup, widgetConfig, onClose }) => {
  if (widgetConfig?.masterTemplateLayout === "master_1") {
    return (
      <EmiPopupLayoutOne
        popup={popup}
        widgetConfig={widgetConfig}
        onClose={onClose}
      />
    );
  }

  if (widgetConfig?.masterTemplateLayout === "master_2") {
    return (
      <EmiPopupLayoutTwo
        popup={popup}
        widgetConfig={widgetConfig}
        onClose={onClose}
      />
    );
  }

  // const { price, applicablePlans, moneyFormatString } = popup;

  // // Helper to format dates like "3rd Sep"
  // const getEmiDate = (monthOffset) => {
  //   const date = new Date();
  //   date.setMonth(date.getMonth() + monthOffset);
  //   return date.toLocaleString("en-US", { month: "short" });
  // };

  // const isSinglePlan = applicablePlans.length === 1;
  // const firstPlan = applicablePlans[0];
  // const firstPlanEmi = getDownPaymentAndEmi(price, firstPlan);

  // return (
  //   <div className="snp_popup_overlay" onClick={onClose}>
  //     <div
  //       className={`snp_popup_card ${
  //         isSinglePlan ? "snp_single_plan_card" : "snp_multi_plan_card"
  //       }`}
  //       onClick={(e) => e.stopPropagation()}
  //     >
  //       <button className="snp_popup_close" onClick={onClose}>
  //         <img
  //           alt="Close"
  //           src="https://assets.snapmint.com/assets/express_checkout/Discount_Images/close_icon.svg"
  //         />
  //       </button>

  //       <div className="snp_popup_header">
  //         <img
  //           src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg"
  //           alt="Pay Later"
  //           className="snp_popup_merchant_img"
  //         />
  //         <div className="snp_popup_merchant_name">
  //           <b>Pay</b> <b>Later</b>
  //         </div>

  //         <div className="snp_popup_pay_text">
  //           Pay
  //           <span className="snp_popup_pay_only">&nbsp;only</span>
  //           <span className="snp_popup_pay_amount">
  //             &nbsp;{moneyFormat(firstPlanEmi.downPayment * 100, moneyFormatString)}
  //           </span>{" "}
  //           Now
  //         </div>

  //         <span className="snp_popup_nocost">
  //           &amp; pay the rest in <b>No Cost EMIs</b>
  //         </span>
  //       </div>

  //       <div className="snp_popup_emi_section">
  //         {/* Top total order value bar */}
  //         <div className="snp_popup_order_bar">
  //           <div className="snp_popup_order_row">
  //             <div>Total Order Value</div>
  //             <div className="snp_popup_order_amt">
  //               &nbsp;{moneyFormat(price * 100, moneyFormatString)}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Conditional rendering based on number of plans */}
  //         {isSinglePlan ? (
  //           <div className="snp_popup_3pie_steps">
  //             <div className="snp_pizza_img_snap">
  //               <img
  //                 src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/1-3_img.png"
  //                 alt="Pie 1"
  //               />
  //               <div className="snp_threepie_emi_amt">
  //                 &nbsp;{moneyFormat(firstPlanEmi.downPayment * 100, moneyFormatString)}
  //               </div>
  //               <div className="snp_emi_date">Pay Now</div>
  //             </div>
  //             <div className="snp_pizza_img_snap">
  //               <img
  //                 src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/2-3_img.png"
  //                 alt="Pie 2"
  //               />
  //               <div className="snp_threepie_emi_amt">
  //                 &nbsp;{moneyFormat(firstPlanEmi.emi * 100, moneyFormatString)}
  //               </div>
  //               <div className="snp_emi_date">
  //                 3<sup>rd</sup> {getEmiDate(1)}
  //               </div>
  //             </div>
  //             <div className="snp_pizza_img_snap">
  //               <img
  //                 src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/3-3_img.png"
  //                 alt="Pie 3"
  //               />
  //               <div className="snp_threepie_emi_amt">
  //                 &nbsp;{moneyFormat(firstPlanEmi.emi * 100, moneyFormatString)}
  //               </div>
  //               <div className="snp_emi_date">
  //                 3<sup>rd</sup> {getEmiDate(2)}
  //               </div>
  //             </div>
  //           </div>
  //         ) : (
  //           <>
  //             <div className="snp_popup_emi_title">EMI Options</div>
  //             <div className="snp_popup_emi_options_list">
  //               {applicablePlans.map((plan, idx) => {
  //                 const { emi } = getDownPaymentAndEmi(price, plan);
  //                 return (
  //                   <div key={idx} className="snp_popup_emi_option_card">
  //                     <span className="snp_popup_emi_option_label">
  //                       OPTION 0{idx + 1}
  //                     </span>
  //                     <div className="snp_popup_emi_option_inner">
  //                       <span className="snp_popup_emi_badge">0% EMI</span>
  //                       <div className="snp_popup_emi_amt">
  //                         {moneyFormat(emi * 100, moneyFormatString)}/mo
  //                       </div>
  //                       <div className="snp_popup_emi_tenure">
  //                         {plan.tenure} months
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           </>
  //         )}
  //       </div>

  //       <div className="snp_popup_footer_badges">
  //         <div className="snp_popup_footer_badge">
  //           0% Interest
  //           <br />
  //           Installments
  //         </div>
  //         <img
  //           className="snp_popup_footer_divider"
  //           src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
  //           alt=""
  //         />
  //         <div className="snp_popup_footer_badge">
  //           0 Extra
  //           <br />
  //           Cost
  //         </div>
  //         <img
  //           className="snp_popup_footer_divider"
  //           src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
  //           alt=""
  //         />
  //         <div className="snp_popup_footer_badge">
  //           UPI &amp; Cards
  //           <br />
  //           accepted
  //         </div>
  //       </div>

  //       <div className="snp_popup_select_section">
  //         <div className="snp_popup_select_text">
  //           Select <b>Pay Later</b> during checkout
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default EmiPopup;
