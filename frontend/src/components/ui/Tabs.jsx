import React, { Fragment, memo, useId, useState } from 'react';

import PropTypes from "prop-types";
import Box from "./box";
import QueryContainer from "./queryContainer";
import Stack from "./stack";

const TabButton = memo(({ tab, index, isSelected, onClick, variant, disableOtherTabs }) => {
    const isDisabled = tab.disabled || (disableOtherTabs && !isSelected);

    return (
        <s-press-button
            data-tab-index={index}
            data-tab-id={tab.id}
            pressed={isSelected ? true : false}
            onClick={isSelected || isDisabled ? null : onClick}
            variant={variant}
            disabled={isDisabled}
            icon={tab.icon}
        >
            {tab.content || tab.label}
        </s-press-button>
    );
});

TabButton.displayName = 'TabButton';

const Tabs = ({
    tabs = [],
    selected = 0,
    onSelect,
    variant = "tertiary",
    gap = "small-300",
    containerName = '',
    boxBackground = 'transparent',
    boxBorder = 'base',
    boxBorderRadius = 'base',
    boxPadding = 'small-300',
    disableOtherTabs = false,
    ...rest
}) => {

    const generatedId = useId();
    const containerNameId = containerName ?? generatedId;
    const [internalSelectedTab, setInternalSelectedTab] = useState(selected);
    const currentSelectedTab = onSelect ? selected : internalSelectedTab;

    const handleTabClick = (id) => {
        if (onSelect) {
            onSelect(id);
        } else {
            setInternalSelectedTab(id);
        }
    };

    return (
        <QueryContainer containerName={containerNameId}>
            <Box
                // paddingBlockEnd={`@container ${containerNameId} (inline-size <= 768px) 'small-400', 'small-500'`}
                border={boxBorder}
                borderRadius={boxBorderRadius}
                padding={boxPadding}
                background={boxBackground}

                {...rest}
            >
                <div className="tabs-scroll-wrapper" role="tablist">
                    <Stack direction="inline" gap={gap}>
                        {tabs.map((tab, index) => (
                            <TabButton
                                key={tab.id || index}
                                tab={tab}
                                index={index}
                                isSelected={currentSelectedTab === tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                variant={variant}
                                disableOtherTabs={disableOtherTabs}
                            />
                        ))}
                    </Stack>
                </div>
            </Box>
        </QueryContainer>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            content: PropTypes.node,
            icon: PropTypes.string,
            disabled: PropTypes.bool,
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ).isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    variant: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
    disableOtherTabs: PropTypes.bool,
    gap: PropTypes.string,
    containerName: PropTypes.string,
    boxBackground: PropTypes.oneOf(["transparent", "base"]),
    boxBorder: PropTypes.oneOf(["none", "base"]),
    boxBorderRadius: PropTypes.oneOf(["none", "base"]),
    boxPadding: PropTypes.string,
};

const TabPanel = memo(({ children }) => {
    return <Fragment>{children}</Fragment>;
});

TabPanel.displayName = 'TabPanel';

TabPanel.propTypes = {
    children: PropTypes.node,
};


export { TabPanel, Tabs };

