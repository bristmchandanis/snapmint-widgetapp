const { SEQUELIZE_DATA_TYPE } = require("../../config/constants");
const sequelize = require("../../config/db");
const { encryptedAttribute } = require("../../utils/encryption");

const Shop = sequelize.define(
  "shop",
  {
    id: {
      type: SEQUELIZE_DATA_TYPE.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    merchantId: encryptedAttribute("merchantId", {
      allowNull: true,
    }),
    merchantToken: encryptedAttribute("merchantToken", {
      allowNull: true,
      comment: "Merchant Token",
    }),
    myshopifyDomain: {
      type: SEQUELIZE_DATA_TYPE.STRING,
      allowNull: false,
      unique: true,
    },
    domain: {
      type: SEQUELIZE_DATA_TYPE.STRING,
      allowNull: true,
    },
    token: encryptedAttribute("token", {
      allowNull: false,
    }),
    name: {
      type: SEQUELIZE_DATA_TYPE.STRING,
      allowNull: true,
    },
    email: {
      type: SEQUELIZE_DATA_TYPE.STRING,
      allowNull: true,
    },
    province: {
      type: SEQUELIZE_DATA_TYPE.STRING(100),
      allowNull: true,
    },
    country: {
      type: SEQUELIZE_DATA_TYPE.STRING(100),
      allowNull: true,
    },
    city: {
      type: SEQUELIZE_DATA_TYPE.STRING(100),
      allowNull: true,
    },
    currency: {
      type: SEQUELIZE_DATA_TYPE.STRING(100),
      allowNull: true,
    },
    ianaTimezone: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    timezone: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    shopOwner: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    moneyFormat: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    moneyWithCurrencyFormat: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    weightUnit: {
      type: SEQUELIZE_DATA_TYPE.STRING(10),
      allowNull: true,
    },
    planDisplayName: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    planName: {
      type: SEQUELIZE_DATA_TYPE.STRING(150),
      allowNull: true,
    },
    chargeId: {
      type: SEQUELIZE_DATA_TYPE.BIGINT,
      allowNull: true,
    },
    recurringCharge: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1", "2"),
      allowNull: false,
      defaultValue: "0",
      comment: "0 = not active, 1 = active, 2 = cancelled",
    },
    planType: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1", "2", "3"),
      allowNull: false,
      defaultValue: "0",
      comment:
        "1 = Advance (old App Plan) 2 = Shopify Plus (New App Plan) 3 = Shopify Basic (New App Plan)",
    },
    planInterval: {
      type: SEQUELIZE_DATA_TYPE.ENUM("1", "2"),
      allowNull: false,
      defaultValue: "1",
      comment: "1 = month, 2 = year",
    },
    billingOn: {
      type: SEQUELIZE_DATA_TYPE.DATEONLY,
      allowNull: true,
    },
    activatedOn: {
      type: SEQUELIZE_DATA_TYPE.DATEONLY,
      allowNull: true,
    },
    cancelledOn: {
      type: SEQUELIZE_DATA_TYPE.DATEONLY,
      allowNull: true,
    },
    trialEndsOn: {
      type: SEQUELIZE_DATA_TYPE.DATEONLY,
      allowNull: true,
    },
    isOlderStore: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1", "2"),
      allowNull: false,
      defaultValue: "2",
      comment:
        "0 = Old App Plan $14 & $134.40 1 = New App Pla $19 & 182.40 2 = App Plan 9 & 86.4	",
    },
    allowDevelopmentStore: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
      comment: "0 = False, 1 = True",
    },
    appStatus: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "1",
      comment: "0 = Disabled 1 = Enable",
    },
    appInstall: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "1",
      comment: "0 = uninstall, 1 = install",
    },
    isScopeUpdate: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "1",
    },
    displaySettings: {
      type: SEQUELIZE_DATA_TYPE.TEXT,
      allowNull: true,
    },
    onboardStatus: {
      type: SEQUELIZE_DATA_TYPE.ENUM("PENDING", "APPROVED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    widgetStatus: {
      type: SEQUELIZE_DATA_TYPE.ENUM("DISABLED", "ENABLED"),
      allowNull: false,
      defaultValue: "DISABLED",
      comment: "DISABLED = Disabled, ENABLED = Enabled",
    },
    allowCustomization: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
      comment: "0 = Disabled, 1 = Enabled",
    },
    hasWebPixel: {
      type: SEQUELIZE_DATA_TYPE.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
      comment: "0 = Disabled, 1 = Enabled",
    },
    webPixelId: {
      type: SEQUELIZE_DATA_TYPE.STRING,
      allowNull: true,
      comment: "Shopify Web Pixel ID",
    },
    colorConfig: {
      type: SEQUELIZE_DATA_TYPE.JSON,
      allowNull: true,
      defaultValue: {},
      comment: "JSON storing all store color configurations (innerLayoutColors & masterPopupColors)",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Shop;
