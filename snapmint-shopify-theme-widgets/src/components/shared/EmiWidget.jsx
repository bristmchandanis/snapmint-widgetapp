import { useMemo, useEffect } from "react";
import {
  getSnpmintInlineWidgetColor,
  getWidgetMetaData,
} from "../../utils/constants";
import { getDownPaymentAndEmi, parseNum } from "../../utils/emiCalculator";
import { getMatchingWidget } from "../../utils/widgetLayoutHelper";
import SingleRowButton from "./EmiWidgetTemplates/SingleRowButton";
import SingleRowLink from "./EmiWidgetTemplates/SingleRowLink";
import MinimalPill from "./EmiWidgetTemplates/MinimalPill";
import TwoRowButton from "./EmiWidgetTemplates/TwoRowButton";

const EmiWidget = ({
  amount,
  currency,
  productName,
  available,
  setIsPopupOpen,
  placement,
  setPrice,
  setMatchedWidget,
  setApplicablePlans,
}) => {
  const metaData = getWidgetMetaData();
  const snapWidgetColor = getSnpmintInlineWidgetColor();
  const plans = useMemo(
    () =>
      (metaData.plans || []).map((p) => ({
        dpRate: p.dp_rate,
        dpType: p.dp_type,
        minAmount: p.min_order_value,
        maxAmount: p.max_order_value,
        emiAmountRate: p.emi_amount_rate,
        tenure: p.tenure,
      })),
    [metaData.plans],
  );

  const price = useMemo(() => {
    const raw = parseNum(amount);
    return raw / 100;
  }, [amount]);

  // Find matching dynamic widget from snapmintWidgetLayout
  const matchedWidget = useMemo(
    () => getMatchingWidget(price, placement),
    [price],
  );

  // Determine which plans are applicable for this price
  const applicablePlans = useMemo(() => {
    if (!price || !matchedWidget) return [];
    return plans.filter((p) => {
      const isPriceValid = price >= p.minAmount && price <= p.maxAmount;
      const isDpTypeValid = matchedWidget?.dpType
        ? p.dpType === matchedWidget.dpType
        : true;
      return isPriceValid && isDpTypeValid;
    });
  }, [price, plans, matchedWidget]);

  // Compute EMI details from the first applicable plan (lowest tenure)
  const defaultEmiData = useMemo(() => {
    if (applicablePlans.length > 0) {
      const lowestTenurePlan = [...applicablePlans].sort(
        (a, b) => Number(a.tenure) - Number(b.tenure),
      )[0];
      const { downPayment, emi } = getDownPaymentAndEmi(
        price,
        lowestTenurePlan,
      );
      return { downPayment, emi, tenure: lowestTenurePlan.tenure };
    }
    return null;
  }, [price, applicablePlans]);

  // Compute dynamic tenure string (e.g. "3/6/9")
  const dynamicTenures = useMemo(() => {
    if (!applicablePlans.length) return "";
    const tenures = applicablePlans.map((p) => p.tenure);
    const uniqueTenures = Array.from(new Set(tenures)).sort((a, b) => a - b);
    return uniqueTenures.join("/");
  }, [applicablePlans]);

  const isAvailable = available !== "false";
  const canDisplay = isAvailable && Boolean(defaultEmiData);

  useEffect(() => {
    if (!canDisplay) {
      setIsPopupOpen(false);
      setPrice(0);
      setMatchedWidget(null);
      setApplicablePlans([]);
    }
  }, [canDisplay]);

  const handleOpenPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canDisplay) return;
    setPrice(price);
    setMatchedWidget(matchedWidget);
    setApplicablePlans(applicablePlans);
    setIsPopupOpen(true);
  };

  if (!canDisplay) return null;

  return (
    <>
      {
        matchedWidget.inlineWidgetConfig.layoutType === "singleRowButton" ?
          <SingleRowButton
            defaultEmiData={defaultEmiData}
            dynamicTenures={dynamicTenures}
            price={price}
            handleOpenPopup={handleOpenPopup}
            applicablePlans={applicablePlans}
            widgetConfig={matchedWidget}
            widgetColor={snapWidgetColor}
          />
       : null
      }
      {
        matchedWidget.inlineWidgetConfig.layoutType === "singleRowLink" ?
            <SingleRowLink
                defaultEmiData={defaultEmiData}
                dynamicTenures={dynamicTenures}
                price={price}
                handleOpenPopup={handleOpenPopup}
                applicablePlans={applicablePlans}
                widgetConfig={matchedWidget}
                widgetColor={snapWidgetColor}
            /> : null
      }
      {
          matchedWidget.inlineWidgetConfig.layoutType === "minimalPill" ?
              <MinimalPill
                  defaultEmiData={defaultEmiData}
                  dynamicTenures={dynamicTenures}
                  price={price}
                  handleOpenPopup={handleOpenPopup}
                  applicablePlans={applicablePlans}
                  widgetConfig={matchedWidget}
                  widgetColor={snapWidgetColor}
              />: null
      }
      {
        matchedWidget.inlineWidgetConfig.layoutType === "minimalPill" ?
            <TwoRowButton
                defaultEmiData={defaultEmiData}
                dynamicTenures={dynamicTenures}
                price={price}
                handleOpenPopup={handleOpenPopup}
                applicablePlans={applicablePlans}
                widgetConfig={matchedWidget}
                widgetColor={snapWidgetColor}
            /> : null
      }
    </>
  );
};

export default EmiWidget;
