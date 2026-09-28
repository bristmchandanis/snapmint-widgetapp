const CryptoJS = require("crypto-js");
const { SEQUELIZE_DATA_TYPE } = require("../config/constants");

let cachedKey = null;
const getSecretKey = () => {
  if (!cachedKey) {
    cachedKey = process.env.ENCRYPTION_KEY;
  }
  if (!cachedKey) {
    throw new Error("ENCRYPTION_KEY is missing.");
  }
  return cachedKey;
};

const isEncrypted = (text) => {
  if (typeof text !== "string" || !text) return false;
  return text.startsWith("U2FsdGVkX1");
};

const encrypt = (text) => {
  if (!text || typeof text !== "string") return text;
  if (isEncrypted(text)) return text;

  try {
    return CryptoJS.AES.encrypt(text, getSecretKey()).toString();
  } catch (error) {
    console.error("[CryptoJS Encryption Error]:", error.message);
    throw error;
  }
};

const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== "string") return encryptedText;
  if (!isEncrypted(encryptedText)) return encryptedText;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, getSecretKey());
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // Fallback if decryption result is empty
    return originalText || encryptedText;
  } catch (error) {
    console.error("[CryptoJS Decryption Error]:", error.message);
    return encryptedText;
  }
};

const encryptedAttribute = (fieldName, extraOptions = {}) => {
  return {
    type: SEQUELIZE_DATA_TYPE.TEXT,
    ...extraOptions,
    get() {
      const rawValue = this.getDataValue(fieldName);
      return decrypt(rawValue);
    },
    set(value) {
      this.setDataValue(fieldName, encrypt(value));
    },
  };
};

module.exports = {
  encrypt,
  decrypt,
  isEncrypted,
  encryptedAttribute,
};
