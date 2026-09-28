import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const DEFAULT_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

const DEFAULT_FORMATS = [
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
];

export default function RichTextEditor({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Write content here...',
  error,
  required = false,
  modules = DEFAULT_MODULES,
  formats = DEFAULT_FORMATS,
  className = '',
  disabled = false,
  minHeight,
  maxHeight,
}) {
  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-800 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`rich-text-editor-container rounded-xl overflow-hidden border bg-white shadow-2xs transition-all ${error
          ? 'border-red-500 focus-within:ring-1 focus-within:ring-red-500'
          : 'border-gray-200 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-900/10 hover:border-gray-300'
          } ${disabled ? 'opacity-100 cursor-default bg-white' : ''}`}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          readOnly={disabled}
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-0.5 animate-in fade-in duration-200">
          {error}
        </p>
      )}

      {/* Scoped CSS styling overrides for Quill to blend seamlessly with Dashboard Design System */}
      <style>{`
        .rich-text-editor-container .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background-color: #ffffff !important;
          padding: 6px 10px !important;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .rich-text-editor-container .ql-formats {
          margin-right: 6px !important;
          background-color: transparent !important;
          display: flex !important;
          align-items: center !important;
          gap: 2px !important;
        }
        .rich-text-editor-container .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          font-size: 0.8125rem !important;
          color: #0f172a !important;
          ${minHeight ? `min-height: ${minHeight} !important;` : ''}
          ${maxHeight ? `max-height: ${maxHeight} !important;` : ''}
        }
        .rich-text-editor-container .ql-editor {
          padding: 10px 14px !important;
          ${minHeight ? `min-height: ${minHeight} !important;` : ''}
          ${maxHeight ? `max-height: ${maxHeight} !important; overflow-y: auto !important;` : ''}
          line-height: 1.6 !important;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: normal !important;
          font-size: 0.8125rem !important;
          left: 14px !important;
        }
        .rich-text-editor-container .ql-snow .ql-stroke {
          stroke: #64748b !important;
        }
        .rich-text-editor-container .ql-snow .ql-fill {
          fill: #64748b !important;
        }
        .rich-text-editor-container .ql-snow .ql-picker {
          color: #475569 !important;
        }
        .rich-text-editor-container .ql-snow button {
          border-radius: 0.375rem !important;
          width: 26px !important;
          height: 26px !important;
          padding: 3px !important;
          background-color: transparent !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background-color 0.15s ease, color 0.15s ease !important;
        }
        .rich-text-editor-container .ql-snow button:hover {
          background-color: #f1f5f9 !important;
        }
        .rich-text-editor-container .ql-snow button.ql-active {
          background-color: #e2e8f0 !important;
        }
        .rich-text-editor-container .ql-snow button:hover .ql-stroke,
        .rich-text-editor-container .ql-snow button.ql-active .ql-stroke {
          stroke: #0f172a !important;
        }
        .rich-text-editor-container .ql-snow button:hover .ql-fill,
        .rich-text-editor-container .ql-snow button.ql-active .ql-fill {
          fill: #0f172a !important;
        }
      `}</style>
    </div>
  );
}
