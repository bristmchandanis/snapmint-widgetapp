const ACTIVITY_ACTIONS = {
    USER_REGISTERED: ({ user }) => ({
        module: 'AUTH',
        description: `New user '${user?.email || 'User'}' registered with role '${user?.role || 'EMPLOYEE'}'.`,
    }),

    USER_LOGIN: ({ user }) => ({
        module: 'AUTH',
        description: `User '${user?.email || 'User'}' logged in successfully.`,
    }),

    USER_LOGOUT: ({ user }) => ({
        module: 'AUTH',
        description: `User '${user?.email || 'User'}' logged out successfully.`,
    }),

    PASSWORD_CHANGED: ({ user }) => ({
        module: 'AUTH',
        description: `User '${user?.email || 'User'}' changed password successfully.`,
    }),

    USER_ROLE_UPDATED: ({ targetUser, role }) => ({
        module: 'AUTH',
        description: `Updated role for user '${targetUser?.email || 'User'}' to '${role}'.`,
    }),

    USER_DELETED: ({ targetUser }) => ({
        module: 'AUTH',
        description: `Deleted user account '${targetUser?.email || 'User'}'.`,
    }),

    STORE_STATUS_UPDATED: ({ shop, message }) => ({
        module: 'STORES',
        description: `Updated status for store '${shop?.name || shop?.myshopifyDomain || 'Store'}': ${message}`,
    }),

    WEB_PIXEL_UPDATED: ({ shop, hasWebPixel }) => ({
        module: 'STORES',
        description: `${hasWebPixel ? 'Enabled' : 'Disabled'} Web Pixel tracking for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    STORE_CUSTOMIZATION_TOGGLED: ({ shop, allowCustomization }) => ({
        module: 'STORES',
        description: `${allowCustomization === '1' || allowCustomization === true ? 'Enabled' : 'Disabled'} customization permission for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    MERCHANT_CREDENTIAL_SAVED: ({ shop, isCreated }) => ({
        module: 'MERCHANT_ONBOARD',
        description: `${isCreated ? 'Added' : 'Updated'} merchant credential for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    MERCHANT_CREDENTIAL_DELETED: ({ shop }) => ({
        module: 'MERCHANT_ONBOARD',
        description: `Deleted merchant credential for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    WIDGET_CONFIG_SAVED: ({ shop, isUpdate }) => ({
        module: 'WIDGET_CUSTOMIZATION',
        description: `${isUpdate ? 'Updated' : 'Created'} widget customization for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    WIDGET_CONFIG_DELETED: ({ shop, id }) => ({
        module: 'WIDGET_CUSTOMIZATION',
        description: `Deleted widget customization #${id} for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    AUTO_SETUP_SAVED: ({ shop }) => ({
        module: 'STORES',
        description: `Configured Auto Setup Selectors (PDP/Cart) for store '${shop?.name || shop?.myshopifyDomain || 'Store'}'.`,
    }),

    SHOPIFY_APP_INSTALLED: ({ shopDomain, shop }) => ({
        module: 'SHOPIFY_APP',
        description: `Snapmint app installed on store '${shop?.name || shopDomain || 'Store'}'.`,
    }),

    SHOPIFY_APP_UNINSTALLED: ({ shopDomain }) => ({
        module: 'SHOPIFY_APP',
        description: `Snapmint app uninstalled from store '${shopDomain}'.`,
    }),
};

module.exports = ACTIVITY_ACTIONS;
