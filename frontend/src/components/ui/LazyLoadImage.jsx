import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LazyLoadImage = ({ src, alt = '', className = '', loading = 'lazy', ...restProps }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    if (isError) {
        return (
            <span className={className} role="alert" aria-label={alt || 'Image failed to load'}>
                ⚠️ Image unavailable
            </span>
        );
    }

    return (
        <React.Fragment>
            {isLoading && (
                <span className={className} aria-busy="true" aria-live="polite">
                    ⏳ Loading...
                </span>
            )}
            <img
                src={src}
                alt={alt}
                loading={loading}
                className={className}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setIsError(true);
                }}
                style={{ display: isLoading ? 'none' : 'initial' }}
                {...restProps}
            />
        </React.Fragment>
    );
};

LazyLoadImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.oneOf(['eager', 'lazy']),
};

export default LazyLoadImage;
