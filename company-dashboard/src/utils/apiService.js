import axios from 'axios';
import { ApiBaseUrl, baseUrl } from './constants';

const instance = axios.create();

const handleAuthExpired = () => {
  localStorage.clear();
  window.location.replace(`${baseUrl}/login`);
};

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const toIdPayload = (val) => {
  if (val === null || val === undefined) return {};
  if (typeof val !== 'object') return { id: val };
  if (val.id !== undefined && typeof val.id === 'object') return toIdPayload(val.id);
  return val;
};

const ApiService = () => {
  const fetchData = async (method, url, data, isFormData, header) => {
    const config = {
      headers: {
        ...(header || {}),
        "content-type": isFormData ? "multipart/form-data" : "application/json",
      }
    };

    let result = '';

    try {
      let res;
      if (method === 'get') {
        res = await instance[method](`${ApiBaseUrl}${url}`, config);
      } else if (method === 'delete') {
        res = await instance[method](`${ApiBaseUrl}${url}`, { ...config, data });
      } else {
        res = await instance[method](`${ApiBaseUrl}${url}`, data, config);
      }

      if (res?.status === 401) {
        handleAuthExpired();
      }

      result = { ...res?.data, apiStatus: res.status };
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthExpired();
      }

      result = {
        ...(error.response?.data || {}),
        message: error.response?.data?.message || 'Something went wrong',
        apiStatus: error.response?.status || 500
      };
    }

    return result;
  };

  const getData = async (url, header) => await fetchData('get', url, null, false, header);

  const postData = async (url, data, isFormData, header) => await fetchData('post', url, data, isFormData, header);

  const putData = async (url, data, isFormData, header) => await fetchData('put', url, data, isFormData, header);

  const patchData = async (url, data, header) => await fetchData('patch', url, data, false, header);

  const deleteData = async (url, data, header) => await fetchData('delete', url, data, false, header);

  return {
    // Auth & User Management
    register: async (data) => await postData('/auth/register', data),

    login: async (data) => await postData('/auth/login', data),

    logout: async () => await postData('/auth/logout'),

    getProfile: async () => await getData('/auth/profile'),

    updateProfile: async (data) => await putData('/auth/profile', data),

    getUsers: async () => await getData('/auth/users'),

    updateUserPermissions: async (data) => await putData('/auth/users/permissions', data),

    deleteUser: async (id) => await deleteData('/auth/users/delete', toIdPayload(id)),

    changePassword: async (data) => await putData('/auth/change-password', data),

    // Role Management
    createRole: async (data) => await postData('/auth/roles/create', data),

    getRoles: async () => await getData('/auth/roles'),

    deleteRole: async (id, reassignRole) => await deleteData('/auth/roles/delete', { id, reassignRole }),

    // Stores Management
    getStores: async () => await getData('/auth/stores'),

    updateStoreStatus: async (data) => await postData('/auth/stores/status', data),

    updateStoreWebPixel: async (data) => await postData('/auth/stores/web-pixel', data),

    // Cashback Offer Management
    getCashbackOffers: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await getData(`/cashback-offer${query ? `?${query}` : ''}`);
    },

    createCashbackOffer: async (data) => await postData('/cashback-offer/create', data),

    updateCashbackOffer: async (id, data) => await putData(`/cashback-offer/update/${id}`, data),

    deleteCashbackOffer: async (id) => await deleteData(`/cashback-offer/delete/${id}`),

    // Store Colors (Shop Table & Metafields)
    getStoreColors: async (shopId) => await getData(`/shop/color-customization/get?shopId=${encodeURIComponent(shopId)}`),

    saveStoreColors: async (data) => await postData('/shop/color-customization/save', data),

    // Widget Customization (Company Dashboard)
    getWidgetCustomization: async (id) => await getData(`/widget-customization/get?id=${encodeURIComponent(id)}`),

    getWidgetCustomizationsList: async () => await getData('/widget-customization/list'),

    addWidgetCustomization: async (data) => await postData('/widget-customization/add', data),

    updateWidgetCustomization: async (data) => await putData('/widget-customization/update', data),

    deleteWidgetCustomization: async (id) => await deleteData('/widget-customization/delete', toIdPayload(id)),

    saveWidgetCustomization: (data = {}) => (data.customizationId || data.id)
      ? putData('/widget-customization/update', data)
      : postData('/widget-customization/add', data),

    // Auto Setup Selectors
    getAutoSetup: async (shopId) => await getData(`/auto-setup/get?shopId=${encodeURIComponent(shopId)}`),

    // Merchant Credentials
    getMerchantCredentials: async () => await getData('/merchant-credentials/list'),

    addMerchantCredential: async (data) => await postData('/merchant-credentials/add', data),

    updateMerchantCredential: async (data) => await putData('/merchant-credentials/update', data),

    deleteMerchantCredential: async (id) => await deleteData('/merchant-credentials/delete', toIdPayload(id)),

    // Activity Logs
    getActivityLogs: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await getData(`/activity-log/list${query ? `?${query}` : ''}`);
    },
  };
};

export default ApiService;
