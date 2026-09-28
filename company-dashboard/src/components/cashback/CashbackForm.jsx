import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { IconArrowLeft, IconSpinner } from '../common/Icons';
import SimpleSelect from '../common/SimpleSelect';
import StepStoreSelection from '../widget/steps/StepStoreSelection';
import Stepper from '../common/Stepper';
import StepNavigation from '../common/StepNavigation';
import RichTextEditor from '../common/RichTextEditor';
import { getCashbackFormFields } from '../../utils/moduleData';
import { generateDefaultTerms } from '../../utils/helpers';
import { validateCashbackForm, validateCashbackField } from '../../validation/cashbackValidation';
import { toast } from 'sonner';

const CASHBACK_TYPE_OPTIONS = [
    { value: 'PERCENTAGE', label: 'Percentage (%)' },
    { value: 'FLAT', label: 'Flat Amount (₹)' },
];

const STEP_LABELS = {
    1: 'Store Selection',
    2: 'Offer Configuration',
};
const TOTAL_STEPS = Object.keys(STEP_LABELS).length;

export default function CashbackFormPage({
    isEditing = false,
    shops = [],
    formData,
    onFormChange,
    onSubmit,
    onCancel,
    saving = false,
    canWrite = true,
    canEdit = true,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const step = Number(searchParams.get('step')) || 1;
    const setStep = (s) => setSearchParams({ ...Object.fromEntries(searchParams), step: s });

    const [acceptedTerms, setAcceptedTerms] = useState(isEditing);
    const [errors, setErrors] = useState({});

    const selectedShop = shops.find((s) => String(s.id) === String(formData.shopId));

    const todayStr = new Date().toISOString().split('T')[0];
    const startDateMin = isEditing ? undefined : todayStr;
    const endDateMin = formData.startDate ? String(formData.startDate).split('T')[0] : todayStr;

    const formFields = getCashbackFormFields(startDateMin, endDateMin, CASHBACK_TYPE_OPTIONS);

    const handleFieldChange = (key, value, type) => {
        const finalVal = type === 'number' ? (value === '' ? '' : Number(value)) : value;

        onFormChange((prev) => {
            const updated = { ...prev, [key]: finalVal };
            if (key !== 'termsText') updated.termsText = generateDefaultTerms(updated, prev.termsText);
            return updated;
        });

        setErrors((prev) => ({ ...prev, [key]: validateCashbackField(key, finalVal, { ...formData, [key]: finalVal }) }));
    };

    const handleNextStep = () => {
        if (!formData.shopId) {
            setErrors((prev) => ({ ...prev, shopId: 'Please select a target store' }));
            toast.error('Please select a target store to proceed');
            return;
        }
        setErrors((prev) => ({ ...prev, shopId: null }));
        setStep(2);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const validation = validateCashbackForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorMsg = Object.values(validation.errors)[0] || 'Please fix the highlighted errors before saving.';
            toast.error(firstErrorMsg);
            return;
        }

        setErrors({});
        onSubmit(e);
    };

    const isReadOnly = (isEditing && !canEdit) || (!canEdit && !canWrite);

    return (
        <form onSubmit={handleFormSubmit} noValidate className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onCancel}
                    title="Go Back to List"
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                >
                    <IconArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {isEditing ? (canEdit ? 'Edit Cashback Offer' : 'View Cashback Offer') : 'Create Cashback Offer'}
                </h1>
            </div>

            <Stepper
                currentStep={step}
                totalSteps={TOTAL_STEPS}
                stepLabels={STEP_LABELS}
                onSelectStep={(targetStep) => {
                    if (targetStep === 1) {
                        setStep(1);
                    } else if (targetStep === 2) {
                        if (isReadOnly || formData.shopId) {
                            setStep(2);
                        } else {
                            toast.error('Please select a target store first.');
                        }
                    }
                }}
            />

            {step === 1 && (
                <div className="space-y-2">
                    <StepStoreSelection
                        shops={shops}
                        selectedShop={selectedShop}
                        onSelectShop={(shop) => {
                            if (!isReadOnly) {
                                onFormChange({ ...formData, shopId: shop.id });
                                setErrors((prev) => ({ ...prev, shopId: null }));
                            }
                        }}
                        onNext={handleNextStep}
                        disabled={isReadOnly}
                    />
                    {errors.shopId && (
                        <p className="text-xs text-red-500 font-medium px-1">
                            {errors.shopId}
                        </p>
                    )}
                </div>
            )}

            {step === 2 && (
                <Card className="w-full rounded-xl border border-gray-200/90 shadow-2xs bg-white">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
                        <div>
                            <CardTitle className="text-sm font-semibold text-gray-900 tracking-tight">
                                Offer & Campaign Details
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formFields.map((field) => {
                                const val = field.valueTransform
                                    ? field.valueTransform(formData[field.key])
                                    : (formData[field.key] ?? '');
                                const fieldErr = errors[field.key];

                                 return (
                                    <div key={field.key} className="space-y-1">
                                        <Label htmlFor={field.key} className="font-semibold text-gray-800 text-xs block">
                                            {field.label} {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                        </Label>
                                        <div>
                                            {field.type === 'select' ? (
                                                <SimpleSelect
                                                    id={field.key}
                                                    name={field.key}
                                                    value={val}
                                                    onValueChange={(v) => !isReadOnly && handleFieldChange(field.key, v, field.type)}
                                                    options={field.options}
                                                    placeholder={field.placeholder}
                                                    disabled={isReadOnly}
                                                    triggerClassName={`w-full h-9 text-xs font-semibold bg-white focus:border-gray-400 focus:ring-0 focus-visible:ring-0 ${fieldErr ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} ${isReadOnly ? 'disabled:opacity-100 disabled:bg-white text-gray-900 cursor-default' : ''}`}
                                                />
                                            ) : (
                                                <Input
                                                    id={field.key}
                                                    name={field.key}
                                                    type={field.type}
                                                    min={field.min}
                                                    max={field.max}
                                                    value={val}
                                                    readOnly={isReadOnly}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => !isReadOnly && handleFieldChange(field.key, e.target.value, field.type)}
                                                    placeholder={field.placeholder}
                                                    className={`text-xs bg-white h-9 focus:border-gray-400 focus:ring-0 focus-visible:ring-0 ${fieldErr ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} ${isReadOnly ? 'disabled:opacity-100 disabled:bg-white text-gray-900 font-semibold cursor-default' : ''}`}
                                                />
                                            )}
                                            {fieldErr && (
                                                <p className="text-[11px] text-red-500 font-medium block mt-0.5 animate-in fade-in duration-200">
                                                    {fieldErr}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-2">
                            <RichTextEditor
                                id="termsText"
                                label="Terms & Conditions"
                                required
                                disabled={isReadOnly}
                                value={formData.termsText || ''}
                                onChange={(content) => !isReadOnly && handleFieldChange('termsText', content, 'text')}
                                placeholder="Type terms and conditions here..."
                                error={errors.termsText}
                                minHeight="140px"
                                maxHeight="220px"
                            />
                            <div className="flex items-center gap-2 pt-1">
                                <Checkbox
                                    id="acceptTermsCheck"
                                    checked={acceptedTerms}
                                    disabled={isReadOnly}
                                    className={isReadOnly ? 'disabled:opacity-100 disabled:cursor-default' : ''}
                                    onCheckedChange={(checked) => !isReadOnly && setAcceptedTerms(Boolean(checked))}
                                />
                                <Label htmlFor="acceptTermsCheck" className="text-gray-700 text-xs cursor-pointer select-none font-medium">
                                    I agree to the <span className="font-bold text-gray-900">Terms & Conditions</span>
                                </Label>
                            </div>
                        </div>

                        <StepNavigation
                            onBack={() => setStep(1)}
                            isSubmit={!isReadOnly}
                            saving={saving}
                            nextText={isEditing ? 'Update Cashback' : 'Save Cashback'}
                            nextDisabled={!formData.shopId || !acceptedTerms}
                        />
                    </CardContent>
                </Card>
            )}
        </form>
    );
}
