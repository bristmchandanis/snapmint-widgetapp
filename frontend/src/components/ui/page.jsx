import React, { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

const Page = ({
    heading,
    inlineSize = 'base',
    aside,
    primaryAction,
    secondaryAction = [],
    breadcrumbAction,
    children,
    ...restProps
}) => {
    const primaryRef = useRef(null);
    const secondaryRefs = useRef({});

    /**
     * Normalize secondary actions so every action has a stable key
     */
    const normalizedSecondaryActions = secondaryAction.map((action, index) => ({
        ...action,
        key: action.key ?? `secondary-action-${index}`,
    }));

    useEffect(() => {
        // ---- Primary action ----
        if (primaryRef.current && primaryAction?.onClick) {
            primaryRef.current.addEventListener('click', primaryAction.onClick);
        }

        // ---- Secondary actions ----
        normalizedSecondaryActions.forEach(action => {
            const el = secondaryRefs.current[action.key];
            if (el && action.onClick) {
                el.addEventListener('click', action.onClick);
            }
        });

        return () => {
            // Cleanup primary
            if (primaryRef.current && primaryAction?.onClick) {
                primaryRef.current.removeEventListener('click', primaryAction.onClick);
            }

            // Cleanup secondary
            normalizedSecondaryActions.forEach(action => {
                const el = secondaryRefs.current[action.key];
                if (el && action.onClick) {
                    el.removeEventListener('click', action.onClick);
                }
            });
        };
    }, [primaryAction, normalizedSecondaryActions]);

    return (
        <s-page
            heading={heading}
            inlineSize={inlineSize}
            aside={aside}
            {...restProps}
        >
            {/* Breadcrumb */}
            {breadcrumbAction?.label && (
                <s-link
                    slot="breadcrumb-actions"
                    onClick={breadcrumbAction.onClick}
                >
                    {breadcrumbAction.label}
                </s-link>
            )}

            {/* Secondary actions */}
            {(normalizedSecondaryActions && normalizedSecondaryActions.length > 0) ? normalizedSecondaryActions.map(action => (
                <s-button
                    key={action.key}
                    ref={el => {
                        if (el) secondaryRefs.current[action.key] = el;
                    }}
                    slot="secondary-actions"
                    variant={action.variant || 'secondary'}
                    disabled={action.disabled}
                >
                    {action.label}
                </s-button>
            )) : null}

            {/* Primary action */}
            {primaryAction && (
                <s-button
                    ref={primaryRef}
                    slot="primary-action"
                    variant={primaryAction.variant || 'primary'}
                    disabled={primaryAction.disabled}
                >
                    {primaryAction.label}
                </s-button>
            )}

            {children}
        </s-page>
    );
};

Page.propTypes = {
    heading: PropTypes.string,
    inlineSize: PropTypes.oneOf(['base', 'small', 'large']),
    aside: PropTypes.string,

    primaryAction: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        variant: PropTypes.string,
    }),

    secondaryAction: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.string,
            onClick: PropTypes.func,
            disabled: PropTypes.bool,
            variant: PropTypes.string,
        })
    ),

    breadcrumbAction: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
    }),

    children: PropTypes.node,
};

export default Page;
