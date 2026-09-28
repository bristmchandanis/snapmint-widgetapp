import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ApiBaseUrl } from "./Constent";

const instance = axios.create();

const ApiService = () => {
  const shopify = useAppBridge();

  if (shopify.environment.mobile || shopify.environment.embedded) {
    instance.interceptors.request.use(async function (config) {
      return await shopify.idToken().then((token) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
    });
  } else {
    instance.interceptors.request.use(function (config) {
      const localData = window.location.search;
      let urlParams = new URLSearchParams(localData);
      urlParams.toString();
      const params = Object.fromEntries(urlParams);
      config.headers["Authorization"] = JSON.stringify(params);
      return config;
    });
  }

  const fetchData = async (method, url, data, isFormData, header) => {
    const config = {
      headers: {
        ...(header || {}),
        "content-type": isFormData ? "multipart/form-data" : "application/json",
      },
    };

    let result = "";

    try {
      const res = await instance[method](
        `${ApiBaseUrl}${url}`,
        { ...data, shop: shopify.config.shop },
        config,
      );
      if (res.status === 200) {
        result = { ...res?.data, apiStatus: res.status };
      } else {
        result = { ...res?.data, apiStatus: res.status };
      }
    } catch (e) {
      result = { ...e.response?.data, apiStatus: e.status };
    }

    return result;
  };

  //----------------------------API-Methods-----------------------------//

  const getData = async (url, header) =>
    await fetchData("get", url, null, false, header);

  const postData = async (url, data, isFormData, header) =>
    await fetchData("post", url, data, isFormData, header);

  const putData = async (url, data, isFormData, header) =>
    await fetchData("put", url, data, isFormData, header);

  const deleteData = async (url, data, isFormData, header) =>
    await fetchData("delete", url, data, isFormData, header);

  return {
    getStoreDetail: async () => await getData(`/shop/getShopDetails`),

    getStoreWidgets: async () =>
      await getData(`/widget-customization/getStoreWidget`),

    getAutoSetup: async () => getData(`/auto-setup/getAutoSetup`),

    saveAutoSetup: async (data) =>
      await postData(`/auto-setup/saveAutoSetup`, data),

    getWidgetCustomization: async (id) =>
      await getData(`/widget-customization/getStoreWidgetById?id=${id}`),

    saveWidgetCustomization: async (data, editId = null) => {
      if (editId) {
        return await putData(`/widget-customization/updateStoreWidget`, data);
      }
      return await postData(`/widget-customization/addStoreWidget`, data);
    },

    deleteWidgetCustomization: async (id) =>
      await deleteData(`/widget-customization/deleteStoreWidget?id=${id}`),

    createWebPixel: async (data = {}) =>
      await postData(`/shop/web-pixel/create`, data),
  };
};
export default ApiService;
