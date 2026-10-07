// 6. CASHBACK OFFER FORM FIELD SCHEMAS
export const getCashbackFormFields = (startDateMin, endDateMin, cashbackTypeOptions = []) => [
  {
    key: 'title',
    label: 'Campaign Title',
    type: 'text',
    required: true,
    placeholder: 'e.g. Mega Cashback Offer',
  },
  {
    key: 'cashbackCreditDays',
    label: 'Cashback Credit Days',
    type: 'number',
    placeholder: 'e.g. 15',
    min: 7,
    max: 30,
  },
  {
    key: 'cashbackType',
    label: 'Cashback Type',
    type: 'select',
    options: cashbackTypeOptions,
    placeholder: 'Select cashback type',
  },
  {
    key: 'cashbackValue',
    label: 'Cashback Amount',
    type: 'number',
    required: true,
    placeholder: 'e.g. 500',
  },
  {
    key: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
    min: startDateMin,
    valueTransform: (val) => (val ? String(val).split('T')[0] : ''),
  },
  {
    key: 'endDate',
    label: 'End Date',
    type: 'date',
    required: true,
    min: endDateMin,
    valueTransform: (val) => (val ? String(val).split('T')[0] : ''),
  },
];
