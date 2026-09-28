import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { ClientID } from "../../utils/Constent";

export const pickThemeAppExtension = (extensions) => {
  if (!Array.isArray(extensions)) return null;

  const values = ["theme_app_extension", "snapmint-emi-widget"];

  return (
    extensions.find(
      (ext) => values.includes(ext?.type) || values.includes(ext?.handle),
    ) || null
  );
};

const useAppThemeURL = ({ autoLoadExtension = false } = {}) => {
  const shopify = useAppBridge();
  const shopDetails = useSelector((state) => state.shopDetails);
  const shop = shopify?.config?.shop || shopDetails?.shop;
  const AppClientID = shopify?.config?.apiKey || ClientID;
  console.log(AppClientID);
  const [themeAppExtension, setThemeAppExtension] = useState(null);
  const [allExtensions, setAllExtensions] = useState([]);
  const [currentThemeId, setCurrentThemeId] = useState("current");
  const hasAutoLoaded = useRef(false);

  const refreshThemeAppExtension = useCallback(async () => {
    try {
      const extensions = await shopify?.app?.extensions?.();
      const formattedExtensions = (extensions || []).map((ext) => {
        return {
          ...ext,
          isBlockStatus:
            Array.isArray(ext?.activations) && ext.activations.length > 0,
        };
      });

      setAllExtensions(formattedExtensions);

      const themeExtension = pickThemeAppExtension(extensions);

      if (themeExtension?.activations) {
        const foundActivation = themeExtension.activations.find(
          (a) =>
            Array.isArray(a.activations) &&
            a.activations.length > 0 &&
            a.activations[0].themeId,
        );
        if (foundActivation) {
          const rawThemeId = foundActivation.activations[0].themeId;
          const parsedThemeId = rawThemeId
            ? String(rawThemeId).split("/").pop()
            : "current";
          setCurrentThemeId(parsedThemeId);
        }
      }

      const formattedThemeExtension = {
        ...themeExtension,
        activations: (themeExtension.activations || []).map((item) => ({
          ...item,
          isBlockStatus:
            item.status === "active" ||
            (Array.isArray(item.activations) && item.activations.length > 0),
        })),
        isBlockStatus:
          themeExtension.status === "active" ||
          (Array.isArray(themeExtension.activations) &&
            themeExtension.activations.some(
              (item) =>
                item.status === "active" ||
                (Array.isArray(item.activations) &&
                  item.activations.length > 0),
            )),
      };
      console.log("formattedThemeExtension", formattedThemeExtension);
      setThemeAppExtension(formattedThemeExtension);
    } catch (error) {
      console.error("error", error);
      setThemeAppExtension(null);
    }
  }, [shopify]);

  useEffect(() => {
    if (autoLoadExtension && !hasAutoLoaded.current) {
      hasAutoLoaded.current = true;
      refreshThemeAppExtension();
    }
  }, [autoLoadExtension, refreshThemeAppExtension]);

  const appThemeURL = useMemo(
    () => ({
      //Shopify Admin Links
      shopifyAdmin: `https://${shop}/admin/themes/current/editor`,
      shopifyCollection: `https://${shop}/collections/all`,
      shopifyThemeEditor: `https://${shop}/admin/themes/current/editor`,

      //Product
      productUrl: (id) => `https://${shop}/admin/products/${id}`,

      //App Embed
      appEmbedUrl: (themeId = "current") =>
        `https://${shop}/admin/themes/${themeId}/editor?context=apps&template=index&activateAppId=${AppClientID}/snapmit`,
      appBlockUrl: (themeId = "current") =>
        `https://${shop}/admin/themes/${themeId}/editor?previewPath=%2Fproducts%2Fgift-card`,
      appCollectionBlockUrl: (themeId = "current") =>
        `https://${shop}/admin/themes/${themeId}/editor?context=apps&template=collection&addAppBlockId=${AppClientID}/collection-widget&target=main-collection-product-grid`,
      appPdpBlockUrl: (themeId = "current") =>
        `https://${shop}/admin/themes/${themeId}/editor?context=apps&template=product&addAppBlockId=${AppClientID}/pdp-widget&target=main-product`,
      appCartBlockUrl: (themeId = "current") =>
        `https://${shop}/admin/themes/${themeId}/editor?context=apps&template=cart&addAppBlockId=${AppClientID}/cart-widget&target=main-cart-items`,
    }),
    [shop, AppClientID],
  );

  return useMemo(
    () => ({
      appThemeURL,
      themeAppExtension,
      refreshThemeAppExtension,
      allExtensions,
      currentThemeId,
    }),
    [
      appThemeURL,
      themeAppExtension,
      refreshThemeAppExtension,
      allExtensions,
      currentThemeId,
    ],
  );
};

export default useAppThemeURL;
