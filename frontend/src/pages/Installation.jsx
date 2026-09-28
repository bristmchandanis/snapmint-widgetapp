import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppBridge } from "@shopify/app-bridge-react";
import useAppThemeURL from "../hooks/useAppThemeURL";
import { apiService } from "../../utils/Constent";
import {
  Page,
  Section,
  Stack,
  Heading,
  Paragraph,
  Box,
  Button,
  Badge,
  Divider,
  Tabs,
} from "../components/ui";
import StepSelectors from "../components/widget/steps/StepSelectors";

function Installation() {
  const { appThemeURL, themeAppExtension } = useAppThemeURL({
    autoLoadExtension: true,
  });

  const { storeDetails } = useSelector((state) => state.shop);
  const shopify = useAppBridge();

  const [selectedMainTab, setSelectedMainTab] = useState("manual");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pdpProductId: "",
    pdpProductHandle: "",
    pdpProductName: "",
    pdpPriceSelector: "",
    pdpVariantId: "",
    pdpProductAvailable: "",
    pdpProductUrl: "",
    pdpWidgetAppendTarget: "",
    pdpWidgetPlacement: "after",
    collectionGridItem: "",
    collectionSalePrice: "",
    collectionProductId: "",
    collectionProductHandle: "",
    collectionProductName: "",
    collectionVariantId: "",
    collectionProductAvailable: "",
    collectionProductUrl: "",
    collectionWidgetAppendTarget: "",
    collectionWidgetPlacement: "after",
    cartItem: "",
    cartTotal: "",
    cartWidgetAppendTarget: "",
    cartWidgetPlacement: "after",
    minCartItem: "",
    minCartTotal: "",
    minCartWidgetAppendTarget: "",
    minCartWidgetPlacement: "after",
    cartDrawerItem: "",
    cartDrawerTotal: "",
    cartDrawerWidgetAppendTarget: "",
    cartDrawerWidgetPlacement: "after",
  });

  const fetchAutoSetup = useCallback(async () => {
    if (!storeDetails?.id) return;
    setLoading(true);
    try {
      const response = await apiService.getAutoSetup(storeDetails.id);
      if (response?.apiStatus === 200 && response?.data?.metafield?.value) {
        setFormData((prev) => ({
          ...prev,
          ...response.data.metafield.value,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [storeDetails?.id]);

  useEffect(() => {
    fetchAutoSetup();
  }, [fetchAutoSetup]);

  const handleSave = async () => {
    if (!storeDetails?.id) return;
    setIsSaving(true);

    const shop =
      shopify?.config?.shop ||
      new URLSearchParams(window.location.search).get("shop");

    const payload = {
      ...formData,
      shopId: storeDetails.id,
      myshopifyDomain: storeDetails?.myshopifyDomain || shop,
    };

    try {
      const response = await apiService.saveAutoSetup(payload);
      if (response?.apiStatus === 200 || response?.success) {
        shopify.toast.show("Saved successfully");
      } else {
        shopify.toast.show(response?.message || "Failed to save");
      }
    } catch (err) {
      shopify.toast.show("Error saving auto setup");
    } finally {
      setIsSaving(false);
    }
  };

  const appBlocks = [
    {
      title: "Collection Widget",
      appKey: "collection-widget",
      shortcode: `<div class="snapmint-collection-widget"></div>`,
    },
    {
      title: "Product Widget",
      appKey: "pdp-widget",
      shortcode: `<div class="snapmint-pdp-widget" data-product-id="{{ product.id }}"></div>`,
    },
    {
      title: "Cart Widget",
      appKey: "cart-widget",
      shortcode: `<div class="snapmint-cart-widget"></div>`,
    },
    {
      title: "Cart Drawer Widget",
      appKey: "cart-drawer-widget",
      shortcode: `<div class="snapmint-cart-drawer-widget"></div>`,
    },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    shopify.toast.show("Copied to clipboard");
  };

  const mainTabs = [
    { id: "manual", label: "Manual Installation" },
    { id: "auto", label: "Auto Setup Configuration" },
  ];

  return (
    <Page heading="App Installation">
      <Stack gap="base" paddingBlockStart="base">
        <Tabs
          tabs={mainTabs}
          selected={selectedMainTab}
          onSelect={setSelectedMainTab}
          variant="tertiary"
        />

        {selectedMainTab === "manual" && (
          <Section>
            <Stack gap="small">
              <Stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="inline" gap="small" alignItems="center">
                  <Heading type="h4">Theme extension</Heading>
                  {themeAppExtension?.isBlockStatus ? (
                    <Badge tone="success">Active</Badge>
                  ) : (
                    <Badge tone="error">Inactive</Badge>
                  )}
                </Stack>
                {!themeAppExtension?.isBlockStatus && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      window.open(appThemeURL.appEmbedUrl(), "_blank")
                    }
                  >
                    Activate
                  </Button>
                )}
              </Stack>
              <Paragraph>
                Activate the embed to feature your offer directly on your
                website.
              </Paragraph>
              <Divider />
              <Heading type="h4">Manual Installation (Shortcodes)</Heading>
              <Paragraph>
                If your theme does not support app blocks, you can manually
                install the widgets by pasting the following HTML shortcodes
                into your theme liquid files. No script tag is needed in your
                theme.liquid.
              </Paragraph>
              <Stack gap="base">
                {appBlocks.map((block) => (
                  <Box
                    key={`manual-${block.appKey}`}
                    border="base"
                    borderRadius="base"
                    padding="small"
                  >
                    <Stack gap="small">
                      <Heading type="h5">{block.title} Shortcode</Heading>
                      <Paragraph>
                        Place this in the corresponding template file where you
                        want the widget to appear.
                      </Paragraph>
                      <Box
                        background="subdued"
                        padding="small"
                        borderRadius="base"
                      >
                        <Stack
                          direction="inline"
                          gap="small"
                          alignItems="center"
                        >
                          <pre
                            style={{
                              margin: 0,
                              overflowX: "auto",
                              flex: "1 1 auto",
                              minWidth: 0,
                              fontFamily: "monospace",
                              fontSize: "13px",
                              color: "var(--p-color-text-subdued)",
                            }}
                          >
                            <code>{block.shortcode}</code>
                          </pre>
                          <Button
                            variant="secondary"
                            onClick={() => handleCopy(block.shortcode)}
                          >
                            Copy
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Section>
        )}

        {selectedMainTab === "auto" && (
          <Stack gap="base">
            {loading ? (
              <Paragraph>Loading configuration...</Paragraph>
            ) : (
              <Stack gap="base">
                <StepSelectors
                  config={formData}
                  onChangeConfig={setFormData}
                  showAllTabs={true}
                  heading="Auto Setup Configuration"
                />

                <Stack direction="inline" justifyContent="end">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={isSaving ? true : undefined}
                  >
                    Save Configuration
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Page>
  );
}

export default Installation;
