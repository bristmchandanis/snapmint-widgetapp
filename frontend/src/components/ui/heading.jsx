import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({
                     children,
                     lineClamp = Infinity,
                     accessibilityRole = 'heading',
                     accessibilityVisibility = 'visible',
                     ...restProps
                 }) => {
    return (
        <s-heading
            lineClamp={lineClamp}
            accessibilityRole={accessibilityRole}
            accessibilityVisibility={accessibilityVisibility}
            {...restProps}
        >
            {children}
        </s-heading>
    );
};

Heading.propTypes = {
    children: PropTypes.node.isRequired,
    lineClamp: PropTypes.number,
    accessibilityRole: PropTypes.oneOf(['none', 'presentation', 'heading']),
    accessibilityVisibility: PropTypes.oneOf(['visible', 'hidden', 'exclusive']),
};

export default Heading;