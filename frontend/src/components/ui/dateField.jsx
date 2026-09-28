import React from "react";
import PropTypes from "prop-types";

const DateField = ({
                       id,
                       name,
                       label,
                       details,
                       placeholder,
                       value,
                       defaultValue,
                       defaultView,
                       view,
                       allow,
                       allowDays,
                       disallow,
                       disallowDays,
                       autocomplete = "on",
                       disabled,
                       readOnly,
                       required,
                       error,
                       labelAccessibilityVisibility = "visible",

                       // Events
                       onBlur,
                       onChange,
                       onFocus,
                       onInput,
                       onInvalid,
                       onViewChange,

                       ...rest
                   }) => {
    return (
        <s-date-field
            id={id}
            name={name}
            label={label}
            details={details}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            defaultView={defaultView}
            view={view}
            allow={allow}
            allowDays={allowDays}
            disallow={disallow}
            disallowDays={disallowDays}
            autocomplete={autocomplete}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            error={error}
            labelAccessibilityVisibility={labelAccessibilityVisibility}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            onInput={onInput}
            onInvalid={onInvalid}
            onViewchange={onViewChange}
            {...rest}
        />
    );
};

DateField.propTypes = {
    /** Identification */
    id: PropTypes.string,
    name: PropTypes.string,

    /** Labels */
    label: PropTypes.string,
    details: PropTypes.string,
    labelAccessibilityVisibility: PropTypes.oneOf(["visible", "exclusive"]),

    /** Value management */
    value: PropTypes.string,
    defaultValue: PropTypes.string,

    /** Month displayed */
    defaultView: PropTypes.string, // YYYY-MM
    view: PropTypes.string,        // YYYY-MM

    /** Allowed & disallowed rules */
    allow: PropTypes.string,
    allowDays: PropTypes.string,
    disallow: PropTypes.string,
    disallowDays: PropTypes.string,

    /** Input behavior */
    placeholder: PropTypes.string,
    autocomplete: PropTypes.oneOf([
        "on",
        "off",
        "bday-day",
        "bday-month",
        "bday-year",
        "bday",
        "cc-expiry-month",
        "cc-expiry-year",
        "cc-expiry",
    ]),

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
    onInvalid: PropTypes.func,
    onViewChange: PropTypes.func,
};

export default DateField;


// Basic
// <DateField
// defaultView="2025-09"
// defaultValue="2025-09-01"
// label="Select date"
//     />

// With allowed ranges

// <DateField
// label="Delivery date"
// allow="2025-01-01--2025-12-31"
// allowDays="monday, tuesday, wednesday, thursday, friday"
// disallow="2025-06"   // whole month not allowed
// onChange={(e) => console.log(e.detail.value)}
// />

//With view change

// <DateField
//     label="Estimate"
//     defaultView="2025-05"
//     onViewChange={(e) => console.log("Month changed:", e.detail.view)}
// />
