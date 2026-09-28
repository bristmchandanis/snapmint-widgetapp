import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({
                   children,
                   id,
                   // Modal specific
                   heading,
                   accessibilityLabel,
                   size = 'base',
                   padding = 'base',
                   // Methods
                   showOverlay,
                   hideOverlay,
                   toggleOverlay,
                   // Event handlers
                   onShow,
                   onHide,
                   onAfterShow,
                   onAfterHide,
                   // Slots
                   primaryAction,
                   secondaryActions,
                   ...otherProps
               }) => {
    return (
        <s-modal
            id={id}
            heading={heading}
            accessibilityLabel={accessibilityLabel}
            size={size}
            padding={padding}
            showOverlay={showOverlay}
            hideOverlay={hideOverlay}
            toggleOverlay={toggleOverlay}
            onShow={onShow}
            onHide={onHide}
            onAfterShow={onAfterShow}
            onAfterHide={onAfterHide}
            {...otherProps}
        >
            {children}
            {primaryAction && (
                {...primaryAction}
            )}
            {secondaryActions && (
              {...secondaryActions}
            )}
        </s-modal>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
    // Modal specific
    heading: PropTypes.string,
    accessibilityLabel: PropTypes.string,
    size: PropTypes.oneOf(['small', 'small-100', 'base', 'large', 'large-100']),
    padding: PropTypes.oneOf(['base', 'none']),
    // Methods
    showOverlay: PropTypes.func,
    hideOverlay: PropTypes.func,
    toggleOverlay: PropTypes.func,
    // Event handlers
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onAfterShow: PropTypes.func,
    onAfterHide: PropTypes.func,
    // Slots
    primaryAction: PropTypes.node,
    secondaryActions: PropTypes.node,
};

export default Modal;

// <Modal
//     id="delete-modal"
//     heading="Delete product?"
//     size="base"
//     primaryAction={
//         <Button variant="primary" tone="critical">
//             Delete product
//         </Button>
//     }
//     secondaryActions={
//         <Button variant="secondary">
//             Cancel
//         </Button>
//     }
// >
//     <Stack gap="base">
//         <Text>Are you sure you want to delete "Winter jacket"?</Text>
//         <Text tone="caution">This action cannot be undone.</Text>
//     </Stack>
// </Modal>