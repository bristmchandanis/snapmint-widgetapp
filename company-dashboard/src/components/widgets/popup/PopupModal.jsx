import React from 'react';
import './PopupModal.css';
import PiePopup from './PiePopup';
import BoxPopup from './BoxPopup';
import MultiLayerPopup from './MultiLayerPopup';
import FixedDepositPopup from './FixedDepositPopup';

export default function PopupModal({
  isOpen = true,
  onClose,
  isInline = false,
  popupStyle = 'pie',
  merchantName = "Neeman's",
  orderValue = 15000,
  downPaymentPercent = 25,
  fixedDp = 1,
  tenure = 3,
  eligibleTenures = [3, 6],
}) {
  if (!isOpen) return null;

  let ModalComponent = PiePopup;
  const style = String(popupStyle).toLowerCase();

  if (style === 'multiplan' || style === 'multi-layer' || style === 'multilayer') {
    ModalComponent = MultiLayerPopup;
  } else if (style === 'box') {
    ModalComponent = BoxPopup;
  } else if (style === 'fixed-dp' || style === 'fixed-deposit' || style === 'fixeddeposit') {
    ModalComponent = FixedDepositPopup;
  } else {
    ModalComponent = PiePopup;
  }

  const modalElement = (
    <ModalComponent
      merchantName={merchantName}
      orderValue={orderValue}
      downPaymentPercent={downPaymentPercent}
      fixedDp={fixedDp}
      tenure={tenure}
      eligibleTenures={eligibleTenures}
      onClose={onClose}
    />
  );

  if (isInline) {
    return <div className="snp-wrapper">{modalElement}</div>;
  }

  return (
    <div className="snp-modal-overlay" onClick={onClose}>
      <div className="snp-wrapper" onClick={(e) => e.stopPropagation()}>
        {modalElement}
      </div>
    </div>
  );
}

export { PiePopup, BoxPopup, MultiLayerPopup, FixedDepositPopup };
