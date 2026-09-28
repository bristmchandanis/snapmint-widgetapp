import React from 'react';
import FormField from '../common/FormField';
import SimpleSelect from '../common/SimpleSelect';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { IconChevronDown, IconChevronUp } from '../common/Icons';
import TemplatePreview from './TemplatePreviews';
import { POPUP_LAYOUT_CARDS } from './PopupLayoutSelector';
import {
  TOGGLE_FIELD_PAIRS,
  MASTER_TEXT_INPUT_FIELDS,
  MASTER_DROPDOWN_FIELDS,
} from '../../utils/moduleData';

const getDefaultFooterText = (templateId) =>
  templateId === 'master_2' || templateId === '2'
    ? 'Select Merchant Pay Later during checkout'
    : 'Select Merchant Pay Later on the payment screen';

export default function MasterModalCustomizer({
  masterTemplateId = 'master_1',
  config,
  onChangeConfig,
  disabled = false,
  isOpen,
  onToggle,
}) {
  const selectedLayoutObj = POPUP_LAYOUT_CARDS.find((cardItem) => cardItem.id === config?.popupLayoutType);
  const layoutDisplayTitle = selectedLayoutObj ? selectedLayoutObj.title : (config?.popupLayoutType || 'Default');

  const updateConfig = (key, val) => {
    if (!disabled && onChangeConfig) {
      onChangeConfig({ ...config, [key]: val });
    }
  };

  const renderTextField = (key, label, placeholder, helpText = null, defaultVal = '') => {
    const val = config?.[key] ?? defaultVal ?? (key === 'footerText' ? getDefaultFooterText(masterTemplateId) : '');
    return (
      <div key={key} className="space-y-1.5 text-left flex flex-col justify-start">
        <FormField
          id={key}
          name={key}
          label={label}
          placeholder={placeholder}
          value={val}
          readOnly={disabled}
          required={false}
          onChange={(e) => updateConfig(key, e.target.value)}
        />
        {helpText && (
          <p className="text-[10.5px] text-gray-400 mt-1 text-left">
            Use <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono text-[10px]">{helpText}</code>
          </p>
        )}
      </div>
    );
  };

  const renderToggleField = ({ toggleKey, textKey, label, placeholder, isSelect, options, help, textDefault, linkedTo, variants, isTextarea }) => {
    const isChecked = config?.[toggleKey] !== false && config?.[toggleKey] !== 'false';
    const selectOptions = (options || []).map((o) => ({ value: o, label: o }));
    const variant = variants?.[config?.[linkedTo]] || variants?.[Object.keys(variants || {})[0]];
    const resolvedLabel = variant?.[0] || label;
    const resolvedDefault = variant?.[1] || textDefault;
    const resolvedPlaceholder = variant?.[2] || placeholder;
    const displayLabel = isSelect ? `${resolvedLabel} Option` : `${resolvedLabel} Text`;

    return (
      <div className={`space-y-1.5 text-left flex flex-col justify-start ${isTextarea ? 'sm:col-span-2' : ''}`} key={toggleKey}>
        <div className="flex items-center justify-between gap-2 h-5 text-left">
          <Label className="text-xs font-semibold text-gray-700">{displayLabel}</Label>
          <Switch
            checked={isChecked}
            disabled={disabled}
            className="scale-75 origin-right"
            onCheckedChange={(checked) => updateConfig(toggleKey, checked)}
          />
        </div>

        <div className={`w-full transition-opacity ${!isChecked ? 'pointer-events-none' : ''}`}>
          {isSelect ? (
            <SimpleSelect
              id={textKey}
              name={textKey}
              value={config?.[textKey] || options[0]}
              onValueChange={(val) => updateConfig(textKey, val)}
              options={selectOptions}
              disabled={disabled || !isChecked}
              triggerClassName="w-full h-9 text-xs font-medium bg-white rounded-lg border border-gray-200 text-gray-900 disabled:opacity-100 disabled:bg-white disabled:text-gray-900"
            />
          ) : (
            <FormField
              id={textKey}
              name={textKey}
              type={isTextarea ? 'textarea' : 'text'}
              label={null}
              placeholder={resolvedPlaceholder}
              value={config?.[textKey] ?? resolvedDefault ?? ''}
              readOnly={disabled || !isChecked}
              disabled={disabled || !isChecked}
              required={false}
              onChange={(e) => updateConfig(textKey, e.target.value)}
            />
          )}
          {help && (
            <p className="text-[10.5px] text-gray-400 mt-1 text-left">
              Use <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono text-[10px]">{help}</code>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden w-full">
      <div
        onClick={onToggle}
        className="p-4 bg-[#f8fafc] hover:bg-slate-100/90 flex flex-row items-center justify-between cursor-pointer select-none transition-colors"
      >
        <h3 className="text-sm font-bold text-gray-900 text-left">
          Master Popup Modal Customization
        </h3>
        <div className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {isOpen ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-5 bg-white border-t border-gray-200 animate-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">

              <div className="space-y-3 text-left">
                <Label className="text-sm font-bold text-gray-900 block tracking-tight">Layout & Variants</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 items-start">
                  <div className="text-left flex flex-col justify-start">
                    <FormField
                      id="popupLayoutType"
                      name="popupLayoutType"
                      label="Layout Type"
                      value={layoutDisplayTitle}
                      readOnly
                      disabled
                      className="w-full h-9 text-xs font-semibold bg-white border border-gray-200 rounded-lg text-gray-900 cursor-default disabled:opacity-100 disabled:bg-white disabled:text-gray-900"
                    />
                  </div>

                  {MASTER_DROPDOWN_FIELDS.map(({ key, label, defaultVal, options }, idx) => (
                    <div key={key} className={`space-y-1.5 text-left ${idx === 1 ? 'sm:col-span-2' : ''}`}>
                      <Label className="text-xs font-semibold text-gray-700 block">{label}</Label>
                      <SimpleSelect
                        value={config?.[key] || defaultVal}
                        onValueChange={(val) => updateConfig(key, val)}
                        options={options.map((o) => ({ value: o, label: o }))}
                        disabled={disabled}
                        triggerClassName="w-full h-9 text-xs font-medium bg-white rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-left">
                <Label className="text-sm font-bold text-gray-900 block tracking-tight">Feature Badges & Offers</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 items-start">
                  {TOGGLE_FIELD_PAIRS.map(renderToggleField)}
                </div>
              </div>

              <div className="space-y-3 text-left">
                <Label className="text-sm font-bold text-gray-900 block tracking-tight">Text Content & Form Labels</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 items-start">
                  {MASTER_TEXT_INPUT_FIELDS.map(({ key, label, placeholder, help, defaultVal }) =>
                    renderTextField(key, label, placeholder, help, defaultVal)
                  )}
                </div>
              </div>

            </div>

            {/* Live Layout Preview */}
            <div className="lg:col-span-5 lg:sticky lg:top-6">
              <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
                <div className="p-4 bg-[#f8fafc] border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 text-left">Live Layout Preview</h3>
                </div>
                <CardContent className="p-2 flex items-center justify-center bg-gray-50/50 py-3 overflow-hidden">
                  <div className="transform scale-85 sm:scale-90 origin-center -my-3">
                    <TemplatePreview
                      templateId={masterTemplateId}
                      sampleAmount={3000}
                      {...config}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
