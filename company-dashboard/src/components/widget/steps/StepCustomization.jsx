import React from 'react';
import WidgetLayoutCustomizer from '../WidgetLayoutCustomizer';

export default function StepCustomization(props) {
  return (
    <div className="w-full">
      <WidgetLayoutCustomizer {...props} />
    </div>
  );
}
