import { useState } from "react";
import { createPortal } from "react-dom";
import EmiPopup from "../shared/EmiPopup";
import EmiWidget from "../shared/EmiWidget";

const SnapMintPDPWidget = ({ amount, currency, productName, available }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [matchedWidget, setMatchedWidget] = useState(null);
  const [applicablePlans, setApplicablePlans] = useState([]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPrice(0);
    setMatchedWidget(null);
    setApplicablePlans([]);
  };

  return (
    <>
      <EmiWidget
        amount={amount}
        currency={currency}
        productName={productName}
        available={available}
        setIsPopupOpen={setIsPopupOpen}
        isPopupOpen={isPopupOpen}
        placement={"PDP"}
        setPrice={setPrice}
        setMatchedWidget={setMatchedWidget}
        setApplicablePlans={setApplicablePlans}
      />

      {isPopupOpen &&
        createPortal(
          <EmiPopup
            popup={{
              price,
              productName,
              applicablePlans,
            }}
            widgetConfig={matchedWidget}
            onClose={handleClosePopup}
          />,
          document.body,
        )}
    </>
  );
};

export default SnapMintPDPWidget;
