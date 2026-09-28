import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmiWidget from "../shared/EmiWidget";
import EmiPopup from "../shared/EmiPopup";

const SnapMintCartWidget = ({ amount, currency, productName, available }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cartAmount, setCartAmount] = useState(amount);
  const [price, setPrice] = useState(0);
  const [matchedWidget, setMatchedWidget] = useState(null);
  const [applicablePlans, setApplicablePlans] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchCart = () => {
      fetch(
        window.Shopify?.routes?.root
          ? window.Shopify.routes.root + "cart.js"
          : "/cart.js",
      )
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.total_price !== undefined) {
            setCartAmount(data.total_price);
          }
        })
        .catch((err) =>
          console.warn("Snapmint: Failed to fetch cart total", err),
        );
    };

    // Initial fetch if amount is missing
    if (!amount) {
      fetchCart();
    } else {
      setCartAmount(amount);
    }

    // Poll cart API to keep EMI synced with cart changes (e.g. quantity updates)
    const interval = setInterval(fetchCart, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [amount]);

  const handleClosePopup = () => {
    setPrice(0);
    setMatchedWidget(null);
    setApplicablePlans([]);
    setIsPopupOpen(false);
  };

  return (
    <>
      <EmiWidget
        amount={cartAmount}
        currency={currency}
        productName={productName}
        available={available}
        setIsPopupOpen={setIsPopupOpen}
        isPopupOpen={isPopupOpen}
        placement={["CART", "CARTDRAWER"]}
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
              currency,
            }}
            widgetConfig={matchedWidget}
            onClose={handleClosePopup}
          />,
          document.body,
        )}
    </>
  );
};

export default SnapMintCartWidget;
