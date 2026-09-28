const sequelize = require('sequelize');

module.exports = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT || 5432,

    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
    SCOPES: process.env.SCOPES,
    SHOPIFY_APP_URI: process.env.SHOPIFY_APP_URI,

    SEQUELIZE_OP: sequelize.Op,
    SEQUELIZE_DATA_TYPE: sequelize.DataTypes,

    FREE_TRIAL_DAYS: process.env.FREE_TRIAL_DAYS || 14,
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',

    ONBOARD_STATUS: {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
    },

    WIDGET_STATUS: {
        DISABLED: 'DISABLED',
        ENABLED: 'ENABLED',
    },

    APP_STATUS: {
        DISABLED: '0',
        ENABLED: '1',
    },

    APP_INSTALL: {
        UNINSTALLED: '0',
        INSTALLED: '1',
    },

    SUPERMASTER_ADMIN: 'SUPERMASTER_ADMIN',
};
