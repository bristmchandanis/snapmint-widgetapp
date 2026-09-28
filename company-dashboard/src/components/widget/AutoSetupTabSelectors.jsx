import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FormField from '../common/FormField';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { TAB_CONFIGS } from '../../utils/moduleData';

export default function AutoSetupTabSelectors({ config = {}, onChangeConfig, showAllTabs = false, disabled = false }) {
  const visibleTabs = showAllTabs
    ? TAB_CONFIGS
    : TAB_CONFIGS.filter((tab) => config[tab.field] || config?.placements?.includes(tab.code));

  const tabs = visibleTabs.length > 0 ? visibleTabs : [TAB_CONFIGS[0]];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const update = (key, value) => onChangeConfig({ ...config, [key]: value });

  return (
    <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50/70 px-4 pt-2 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 cursor-pointer ${currentTab.id === tab.id
                ? 'border-gray-900 bg-white text-gray-900 shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {currentTab.fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              value={config?.[field.name] ?? ''}
              disabled={disabled}
              required={false}
              onChange={(event) => update(field.name, event.target.value)}
            />
          ))}

          <div className="space-y-1.5 text-left">
            <Label className="text-xs font-bold text-gray-700 tracking-wide block">Widget Placement Position</Label>
            <Select
              disabled={disabled}
              value={config?.[currentTab.placementField] || 'after'}
              onValueChange={(value) => update(currentTab.placementField, value)}
            >
              <SelectTrigger className="w-full h-10 text-xs font-medium bg-gray-50/50 px-3.5">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after">After</SelectItem>
                <SelectItem value="before">Before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
