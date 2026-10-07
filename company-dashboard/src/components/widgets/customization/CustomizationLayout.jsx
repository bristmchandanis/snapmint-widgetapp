import React from 'react';
import { Button } from '@/components/ui/button';
import CouponListPopup from '../popup/CouponListPopup';
import CustomizationHeader from './CustomizationHeader';
import ElementInspector from './ElementInspector';
import AssetsSection from './AssetsSection';
import ThemeSection from './ThemeSection';
import ColoursSection from './ColoursSection';
import TextSection from './TextSection';
import CornerRadiusSection from './CornerRadiusSection';
import CashbackSection from './CashbackSection';
import OffersSection from './OffersSection';
import CouponsSection from './CouponsSection';
import RbiSection from './RbiSection';
import { formatBrandingLabel } from '../Customization';

export default function CustomizationLayout({
  safeMerchant,
  brandingMode,
  onBack,
  handleSave,
  activePlacement,
  setActivePlacement,
  isPlacementEnabled,
  selectedPlanPreviewMode,
  setSelectedPlanPreviewMode,
  hasMultiPlan,
  selectedFutureRepayments,
  setSelectedFutureRepayments,
  availableFutureRepayments,
  activePopupStyle,
  setActivePopupStyle,
  applicableStyles,
  selectedPlanPreview,
  currentPopupType,
  isExpressPlacement,
  ActivePopup,
  livePreviewStyles,
  popupTenure,
  state,
  inspector,
  handleElementColorChange,
}) {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-5 p-4 sm:p-5 bg-gray-50/50 items-stretch">
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
        <CustomizationHeader
          activePlacement={activePlacement}
          setActivePlacement={setActivePlacement}
          isPlacementEnabled={isPlacementEnabled}
          selectedPlanPreviewMode={selectedPlanPreviewMode}
          setSelectedPlanPreviewMode={setSelectedPlanPreviewMode}
          hasMultiPlan={hasMultiPlan}
          selectedFutureRepayments={selectedFutureRepayments}
          setSelectedFutureRepayments={setSelectedFutureRepayments}
          availableFutureRepayments={availableFutureRepayments}
          activePopupStyle={activePopupStyle}
          setActivePopupStyle={setActivePopupStyle}
          applicableStyles={applicableStyles}
          className="py-1 shrink-0"
        />

        <div className="flex-1 min-h-0 rounded-2xl border border-gray-200 bg-gray-100 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-y-auto">
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => { inspector.setIsSelectMode(m => !m); if (inspector.isSelectMode) inspector.setSelectedElement(null); }}
              className={`backdrop-blur-sm border px-3 py-1.5 rounded-md text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${inspector.isSelectMode
                ? 'bg-[#513487] text-white border-[#513487] hover:bg-[#432b71]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
            >
              <span>{inspector.isSelectMode ? 'Done selecting' : 'Select element'}</span>
            </button>
          </div>

          <div
            ref={inspector.previewContainerRef}
            className={`w-full max-w-[420px] transition-all duration-300 drop-shadow-xl ${inspector.isSelectMode ? 'snp-select-mode' : ''}`}
            style={livePreviewStyles}
            onMouseOver={inspector.handlePreviewMouseOver}
            onMouseLeave={inspector.handlePreviewMouseLeave}
            onClickCapture={inspector.isSelectMode ? inspector.handlePreviewClick : undefined}
          >
            {state.previewMode === 'coupon-list' ? (
              <CouponListPopup
                coupons={state.coupons}
                initialOrderValue={15000}
                appliedCoupon={state.appliedCoupon}
                onApply={(coupon) => {
                  state.setAppliedCoupon(coupon);
                  if (coupon) state.setPreviewMode('popup');
                }}
                onClose={() => state.setPreviewMode('popup')}
              />
            ) : (
              <ActivePopup
                merchantName={safeMerchant}
                orderValue={15000}
                downPaymentPercent={selectedPlanPreview === 'pie' ? (100 / (Number(selectedFutureRepayments) + 1)) : 33.333333}
                tenure={popupTenure}
                fixedDp={1}
                eligibleTenures={[3, 6]}
                popupType={currentPopupType}
                showExpress={isExpressPlacement}
                expressTab={state.expressTab}
                onExpressTabChange={state.setExpressTab}
                customText={state.customText}
                cashback={state.cashback}
                offers={state.offers}
                coupons={{ ...state.coupons, enabled: state.isCouponsEnabledInConfig }}
                appliedCoupon={state.appliedCoupon}
                onOpenCoupons={() => {
                  if (!inspector.isSelectMode) state.setPreviewMode('coupon-list');
                }}
                rbi={state.rbi}
                onClose={() => { }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[380px] xl:w-[390px] bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs border border-gray-200">
                {safeMerchant.charAt(0) || 'C'}
              </div>
              <span className="text-xs font-bold text-gray-900 truncate max-w-[170px]">{safeMerchant}</span>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-200/60 shadow-2xs">
              {formatBrandingLabel(brandingMode)}
            </span>
          </div>

          <h2 className="text-base font-bold text-gray-900 tracking-tight">Pop-up appearance</h2>

          <div className="flex items-center justify-between mt-2.5">
            <button
              type="button"
              onClick={state.handleResetEverything}
              className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-[#c5b8e4] text-[#513487] hover:bg-[#f6f2fb] cursor-pointer transition-colors shadow-xs"
            >
              Reset everything
            </button>
            {state.lastStateBeforeReset && (
              <button
                type="button"
                onClick={state.handleUndoReset}
                className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
              >
                Undo reset
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          <ElementInspector
            selectedElement={inspector.selectedElement}
            onClose={() => { inspector.setSelectedElement(null); state.setActivePickerField(null); }}
            editorTab={inspector.editorTab}
            setEditorTab={inspector.setEditorTab}
            elementOverrides={inspector.elementOverrides}
            setElementOverrides={inspector.setElementOverrides}
            activePickerField={state.activePickerField}
            setActivePickerField={state.setActivePickerField}
            handleElementColorChange={handleElementColorChange}
            colors={state.colors}
            offers={state.offers}
            rbi={state.rbi}
            cashback={state.cashback}
            coupons={state.coupons}
          />

          <AssetsSection
            merchantName={safeMerchant}
            isOpen={state.openSections.assets}
            onToggle={() => state.toggleSection('assets')}
            brandLogo={state.brandLogo}
            logoInputRef={state.logoInputRef}
            onUploadLogo={state.handleUploadLogo}
            onRemoveLogo={state.handleRemoveLogo}
            brandColoursOpen={state.openSections.brandColours}
            onToggleBrandColours={() => state.toggleSection('brandColours')}
            brandColors={state.brandColors}
            onAddBrandColor={state.handleAddBrandColor}
            onUpdateBrandColor={state.handleUpdateBrandColor}
            onRemoveBrandColor={state.handleRemoveBrandColor}
            paletteInputRef={state.paletteInputRef}
            onUploadPalette={state.handleUploadPalette}
            logoColors={state.logoColors}
            onSelectLogoColor={state.handleSelectLogoColor}
            onApplyPaletteColor={state.handleApplyPaletteColor}
            typographyOpen={state.openSections.typography}
            onToggleTypography={() => state.toggleSection('typography')}
            hasUploadedFonts={state.hasUploadedFonts}
            titleFont={state.titleFont}
            bodyFont={state.bodyFont}
            fontOptions={state.fontOptions}
            isEditingTypography={state.isEditingTypography}
            setIsEditingTypography={state.setIsEditingTypography}
            onUploadFont={state.handleUploadFont}
            setTitleFont={state.setTitleFont}
            setBodyFont={state.setBodyFont}
          />
          <ThemeSection
            isOpen={state.openSections.theme}
            onToggle={() => state.toggleSection('theme')}
            selectedTheme={state.selectedTheme}
            onSelectTheme={state.handleSelectTheme}
          />

          <ColoursSection
            coloursOpen={state.openSections.colours}
            onToggleColours={() => state.toggleSection('colours')}
            expressBottomOpen={state.openSections.expressBottom}
            onToggleExpressBottom={() => state.toggleSection('expressBottom')}
            moreColoursOpen={state.openSections.moreColours}
            onToggleMoreColours={() => state.toggleSection('moreColours')}
            colors={state.colors}
            onColorChange={state.handleColorChange}
            onApplyPaletteColor={state.handleApplyPaletteColor}
            onResetColors={state.handleResetColors}
            activePickerField={state.activePickerField}
            setActivePickerField={state.setActivePickerField}
            brandColors={state.brandColors}
            logoColors={state.logoColors}
            isExpressPlacement={isExpressPlacement}
            expressTab={state.expressTab}
            onExpressTabChange={state.setExpressTab}
          />
          <TextSection
            isOpen={state.openSections.changeText}
            onToggle={() => state.toggleSection('changeText')}
            customText={state.customText}
            setCustomText={state.setCustomText}
            onResetText={state.handleResetText}
          />

          <CornerRadiusSection
            isOpen={state.openSections.cornerRadius}
            onToggle={() => state.toggleSection('cornerRadius')}
            cornerRadii={state.cornerRadii}
            setCornerRadii={state.setCornerRadii}
          />

          <CashbackSection
            isOpen={state.openSections.cashback}
            onToggle={() => state.toggleSection('cashback')}
            cashback={state.cashback}
            setCashback={state.setCashback}
          />

          <OffersSection
            isOpen={state.openSections.offers}
            onToggle={() => state.toggleSection('offers')}
            offers={state.offers}
            setOffers={state.setOffers}
          />

          <CouponsSection
            isCouponPageMode={state.previewMode === 'coupon-list'}
            isOpen={state.openSections.coupons}
            onToggle={() => state.toggleSection('coupons')}
            coupons={state.coupons}
            setCoupons={state.setCoupons}
            onPreviewList={() => state.setPreviewMode('coupon-list')}
          />

          <RbiSection
            isOpen={state.openSections.rbi}
            onToggle={() => state.toggleSection('rbi')}
            rbi={state.rbi}
            setRbi={state.setRbi}
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white space-y-1.5 shrink-0">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              className="h-8 px-4 bg-[#151E29] hover:bg-black text-white text-xs font-medium rounded-md cursor-pointer shadow-xs"
            >
              Save appearance
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 text-right pr-1">Unsaved changes · preview updated</p>
        </div>
      </div>
    </div>
  );
}
