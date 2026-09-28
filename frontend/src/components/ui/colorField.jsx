import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const ColorField = ({
    id,
    name,
    label,
    details,
    placeholder,
    value,
    defaultValue,
    autocomplete = "on",
    alpha = true,
    disabled,
    readOnly,
    required,
    error,
    labelAccessibilityVisibility = "visible",
    onBlur,
    onChange,
    onFocus,
    onInput,
    requiredIndicator,
    ...rest
}) => {
    // Use a wrapper div ref — React cannot attach refs to web components directly
    const wrapperRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // Query the actual web component element from within the wrapper div
        const el = wrapper.querySelector('s-color-field');
        if (!el) return;

        const handleEvent = (e) => {
            const val = e?.detail?.value ?? e?.target?.value ?? el.value ?? el.getAttribute('value') ?? '';
            if (e.type === 'input' && onInput) {
                onInput({ target: { value: val }, detail: { value: val } });
            }
            if (e.type === 'change' && onChange) {
                onChange({ target: { value: val }, detail: { value: val } });
            }
        };

        el.addEventListener('input', handleEvent);
        el.addEventListener('change', handleEvent);

        return () => {
            el.removeEventListener('input', handleEvent);
            el.removeEventListener('change', handleEvent);
        };
    }, [onInput, onChange]);

    return (
        // wrapper div carries the ref — NOT the web component itself
        <div ref={wrapperRef} style={{ display: 'contents' }}>
            <s-color-field
                id={id}
                name={name}
                label={label}
                details={details}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                autocomplete={autocomplete}
                alpha={alpha}
                disabled={disabled}
                readOnly={readOnly}
                required={required || requiredIndicator}
                error={error}
                labelAccessibilityVisibility={labelAccessibilityVisibility}
                onBlur={onBlur}
                onFocus={onFocus}
                onInput={(e) => {
                    const val = e?.detail?.value ?? e?.target?.value ?? '';
                    if (onInput) onInput({ target: { value: val }, detail: { value: val } });
                }}
                onChange={(e) => {
                    const val = e?.detail?.value ?? e?.target?.value ?? '';
                    if (onChange) onChange({ target: { value: val }, detail: { value: val } });
                }}
                {...rest}
            />
        </div>
    );
};

ColorField.propTypes = {
    /** Identification */
    id: PropTypes.string,
    name: PropTypes.string,

    /** Label system */
    label: PropTypes.string,
    details: PropTypes.string,
    labelAccessibilityVisibility: PropTypes.oneOf(["visible", "exclusive"]),

    /** Input behavior */
    placeholder: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    autocomplete: PropTypes.oneOf(["on", "off"]),

    /** Color options */
    alpha: PropTypes.bool,

    /** Field state */
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,

    /** Events */
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
};

export default ColorField;
