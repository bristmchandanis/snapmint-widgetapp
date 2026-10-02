import React, { memo, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import ColorInput from '@/components/common/ColorInput';

const FONT_TYPES = [
  { type: 'title', label: '+ Upload title font', hint: 'Used for pop-up titles', title: 'Title font', addLabel: 'Add a heading font' },
  { type: 'body', label: '+ Upload body font', hint: 'Used for all other text', title: 'Body font', addLabel: 'Add a body font' },
];

const AssetsSection = memo(function AssetsSection({
  merchantName = "Neeman's",
  isOpen,
  onToggle,
  brandLogo,
  logoInputRef,
  onUploadLogo,
  onRemoveLogo,
  brandColoursOpen,
  onToggleBrandColours,
  brandColors = [],
  onAddBrandColor,
  onUpdateBrandColor,
  onRemoveBrandColor,
  paletteInputRef,
  onUploadPalette,
  logoColors = [],
  onSelectLogoColor,
  onApplyPaletteColor,
  typographyOpen,
  onToggleTypography,
  hasUploadedFonts,
  titleFont,
  bodyFont,
  fontOptions = [],
  isEditingTypography,
  setIsEditingTypography,
  onUploadFont,
  setTitleFont,
  setBodyFont,
}) {
  const [newlyAddedIdx, setNewlyAddedIdx] = useState(null);

  const handleAdd = useCallback(() => {
    setNewlyAddedIdx(brandColors.length);
    onAddBrandColor();
  }, [brandColors.length, onAddBrandColor]);

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between font-bold text-xs text-gray-900 cursor-pointer"
      >
        <span>{merchantName.endsWith("'s") ? merchantName : `${merchantName}'s`} Assets</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4">
          {/* 1. Upload Brand Logo */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={logoInputRef}
              accept="image/png,image/jpeg,image/webp,image/*"
              className="hidden"
              onChange={onUploadLogo}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-[72px] h-[58px] border border-gray-200 rounded-md bg-white hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer shrink-0 shadow-2xs overflow-hidden p-1"
            >
              {brandLogo ? (
                <img src={brandLogo} alt="Logo" className="w-full h-full object-cover rounded-sm" />
              ) : (
                <>
                  <Plus className="w-4 h-4 text-gray-400 mb-0.5" />
                  <span className="text-[11px] font-medium text-gray-600">Add logo</span>
                </>
              )}
            </button>
            <div>
              <div className="text-xs font-semibold text-gray-800">Upload brand logo</div>
              <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">PNG, JPG or WebP · up to 2 MB</div>
              {brandLogo && (
                <button
                  type="button"
                  onClick={onRemoveLogo}
                  className="text-[11px] text-gray-500 hover:text-red-500 cursor-pointer block mt-1 underline"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* 2. Brand Colours Sub-section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={onToggleBrandColours}
                className="font-bold text-xs text-gray-900 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Brand colours</span>
                {brandColoursOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                + Add colour
              </button>
            </div>

            {brandColoursOpen && (
              <div className="space-y-2.5">
                <div className="text-[10px] text-gray-400 leading-tight">
                  Add {merchantName.endsWith("'s") ? merchantName : `${merchantName}'s`} brand colours here, or upload a palette to detect them.
                </div>

                {brandColors.length > 0 && (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {brandColors.map((color, idx) => (
                      <ColorInput
                        key={idx}
                        value={color}
                        autoOpen={idx === newlyAddedIdx}
                        onChange={(val) => {
                          if (idx === newlyAddedIdx) setNewlyAddedIdx(null);
                          onUpdateBrandColor(idx, val);
                          onApplyPaletteColor('brandAccent', val.toUpperCase());
                        }}
                        onRemove={() => onRemoveBrandColor(idx)}
                      />
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  ref={paletteInputRef}
                  accept="image/*,.txt,.csv,.json"
                  className="hidden"
                  onChange={onUploadPalette}
                />

                <button
                  type="button"
                  onClick={() => paletteInputRef.current?.click()}
                  className="w-fit px-3 py-1.5 border border-dashed border-gray-300 rounded-md text-[11px] font-semibold text-slate-700 bg-white hover:bg-gray-50 flex items-center justify-center transition-all cursor-pointer shadow-2xs mt-1"
                >
                  Upload brand colours
                </button>
                <div className="text-[10px] text-gray-400 leading-tight">
                  Palette image or HEX colours in TXT, CSV or JSON.
                </div>

                {brandLogo && logoColors.length > 0 && (
                  <div className="pt-1.5">
                    <div className="text-[11px] font-semibold text-gray-500 mb-1.5">Detected from logo</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {logoColors.map((color, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onSelectLogoColor(color)}
                          className="w-4.5 h-4.5 rounded-full border border-black/10 cursor-pointer hover:scale-115 transition-transform shadow-2xs"
                          style={{ backgroundColor: color }}
                          title={`Add & apply ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* 3. Typography Sub-section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={onToggleTypography}
                className="font-bold text-xs text-gray-900 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Typography</span>
                {typographyOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
              </button>
              {hasUploadedFonts && (
                <button
                  type="button"
                  onClick={() => setIsEditingTypography((prev) => !prev)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  {isEditingTypography ? 'Done' : 'Edit'}
                </button>
              )}
            </div>

            {typographyOpen && (
              <div>
                {!hasUploadedFonts ? (
                  <div className="mt-2.5 space-y-2">
                    {FONT_TYPES.map(({ type, label, hint }) => (
                      <label
                        key={type}
                        className="w-full h-10 px-3.5 border border-dashed border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between cursor-pointer text-left shadow-2xs"
                      >
                        <span className="text-xs font-semibold text-slate-700">{label}</span>
                        <span className="text-[11px] text-gray-400">{hint}</span>
                        <input
                          type="file"
                          accept=".woff,.woff2,.ttf,.otf"
                          className="hidden"
                          onChange={(e) => onUploadFont(type, e)}
                        />
                      </label>
                    ))}
                    <div className="text-[11px] text-gray-400 pt-0.5 leading-relaxed">
                      <div>WOFF, WOFF2, TTF or OTF · up to 1 MB each</div>
                      <div>Preview fonts are used until you upload yours.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-0.5">
                    {!isEditingTypography && (
                      <div className="space-y-1 text-xs leading-normal">
                        {[
                          { label: 'Title', font: titleFont },
                          { label: 'Body', font: bodyFont },
                        ].map(({ label, font }) => (
                          <div key={label} className="flex items-baseline gap-2.5 min-w-0">
                            <span className="text-gray-400 font-normal shrink-0">{label}</span>
                            <span className="font-medium text-gray-800 break-all">{font || 'Default'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {Boolean(isEditingTypography) && (
                      <div className="space-y-3 pt-1">
                        {FONT_TYPES.map(({ type, title }) => {
                          const currentVal = type === 'title' ? titleFont : bodyFont;
                          const setVal = type === 'title' ? setTitleFont : setBodyFont;
                          return (
                            <div key={type}>
                              <label className="block text-xs text-gray-500 mb-1.5">{title}</label>
                              <div className="relative">
                                <select
                                  value={currentVal || ''}
                                  onChange={(e) => setVal(e.target.value || null)}
                                  className="w-full h-9 px-3 pr-8 border border-gray-200 rounded-md text-xs bg-white text-gray-800 appearance-none focus:outline-none focus:border-gray-400 cursor-pointer shadow-2xs"
                                >
                                  <option value="">Default</option>
                                  {fontOptions.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
                              </div>
                            </div>
                          );
                        })}

                        {FONT_TYPES.map(({ type, addLabel }) => (
                          <div key={type}>
                            <label className="block text-xs text-gray-700 mb-1">{addLabel}</label>
                            <input
                              type="file"
                              accept=".woff,.woff2,.ttf,.otf"
                              onChange={(e) => onUploadFont(type, e)}
                              className="block w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border file:border-gray-300 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                            />
                          </div>
                        ))}

                        <div className="text-[10px] text-gray-400 pt-1 leading-tight">
                          WOFF, WOFF2, TTF or OTF · up to 1 MB each
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default AssetsSection;
