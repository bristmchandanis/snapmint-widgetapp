import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '../common/Icons';
import InlineBannerCustomizer from './InlineCustomizer';
import MasterModalCustomizer from './MasterCustomizer';

export default function WidgetLayoutCustomizer({
  masterTemplateId = 'master_1',
  selectedShop,
  config,
  onChangeConfig,
  onSaveConfig,
  saving = false,
  disabled = false,
  onBack,
}) {
  const [activeAccordions, setActiveAccordions] = useState({
    inlineBanner: true,
    masterModal: false,
  });

  const toggleAccordion = (key) => {
    setActiveAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <InlineBannerCustomizer
        selectedShop={selectedShop}
        config={config}
        onChangeConfig={onChangeConfig}
        disabled={disabled}
        isOpen={activeAccordions.inlineBanner}
        onToggle={() => toggleAccordion('inlineBanner')}
      />

      <MasterModalCustomizer
        masterTemplateId={masterTemplateId}
        config={config}
        onChangeConfig={onChangeConfig}
        disabled={disabled}
        isOpen={activeAccordions.masterModal}
        onToggle={() => toggleAccordion('masterModal')}
      />

      <div className="pt-2 flex items-center justify-between">
        {onBack ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold px-3.5 h-8 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        ) : <div />}

        {!disabled && (
          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={onSaveConfig}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            {saving ? 'Saving' : 'Save Config'}
          </Button>
        )}
      </div>

    </div>
  );
}
