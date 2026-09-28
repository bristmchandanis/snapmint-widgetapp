import React from 'react';

export const calculateEMISchedule = (sampleAmount) => {
  const totalAmount = Number(sampleAmount) || 0;
  const downPayment = Math.round(totalAmount / 3);
  const emi1 = Math.round(totalAmount / 3);
  const emi2 = totalAmount - downPayment - emi1;
  return { totalAmount, downPayment, emi1, emi2 };
};

export const formatButtonText = (buttonText, downPayment) => {
  const safeText = typeof buttonText === 'string' ? buttonText : '';
  const amountVal = Number(downPayment) || 0;
  return safeText.includes('{amount}')
    ? safeText.replace('{amount}', amountVal > 0 ? amountVal.toLocaleString() : '')
    : safeText;
};

export const renderFeatureText = (text) => {
  if (!text) return null;
  if (text.includes('<br')) {
    const parts = text.split(/<br\s*\/?>/i);
    return parts.map((part, i) => (
      React.createElement(React.Fragment, { key: i },
        i > 0 && React.createElement('br'),
        part
      )
    ));
  }
  const words = text.trim().split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    return React.createElement(React.Fragment, null, line1, React.createElement('br'), line2);
  }
  return text;
};

export const renderFormattedText = (text) => {
  if (!text) return null;
  if (typeof text === 'string' && (text.includes('<b>') || text.includes('<strong>'))) {
    return React.createElement('span', { dangerouslySetInnerHTML: { __html: text } });
  }
  return text;
};

export const renderFooterText = (text) => {
  if (!text) return null;
  if (typeof text === 'string') {
    if (text.includes('<b>') || text.includes('<strong>')) {
      return React.createElement('span', { dangerouslySetInnerHTML: { __html: text } });
    }
    let formatted = text
      .replace(/Merchant Pay Later/g, '<b>Merchant Pay Later</b>')
      .replace(/payment screen/g, '<b>payment screen</b>')
      .replace(/checkout/g, '<b>checkout</b>');

    if (formatted !== text) {
      return React.createElement('span', { dangerouslySetInnerHTML: { __html: formatted } });
    }
  }
  return text;
};

export const getSoftBgTint = (colorStr) => {
  if (!colorStr || colorStr === '#ffffff' || colorStr === 'transparent') return '#f3f4f6';
  if (colorStr.startsWith('rgba') || colorStr.startsWith('hsla')) return colorStr;
  let hex = colorStr.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `rgba(${r}, ${g}, ${b}, 0.15)`;
    }
  }
  return colorStr;
};

export const getGradientBg = (colorStr) => {
  if (!colorStr || colorStr === '#ffffff' || colorStr === 'transparent') {
    return 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)';
  }
  if (colorStr.includes('gradient')) return colorStr;
  let hex = colorStr.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.2) 0%, #ffffff 100%)`;
    }
  }
  return `linear-gradient(180deg, ${colorStr} 0%, #ffffff 100%)`;
};

export const getNextMonthNames = () => {
  const today = new Date();
  const day = today.getDate();
  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  const dayOrdinal = `${day}${getOrdinal(day)}`;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const nextMonth1 = monthNames[(today.getMonth() + 1) % 12];
  const nextMonth2 = monthNames[(today.getMonth() + 2) % 12];
  return { day, dayOrdinal, nextMonth1, nextMonth2 };
};
