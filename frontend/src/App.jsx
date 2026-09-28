import React, { useEffect } from "react";
import AppRoutes from "./routes";
import { AppNavMenu } from "./routes/appNavMenu";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../utils/Constent";
import { setLoading, setStoreDetails, setError } from "./redux/slices/shopSlice";
import { useAppBridge } from "@shopify/app-bridge-react";
import { runAfterPaint, cancelAfterPaint } from "./utils/runAfterPaint";
import { Page, Section, Box, Stack, Banner, Heading, Text, Link } from "./components/ui";

const OnboardingPendingScreen = () => (
  <Page heading="Onboarding Pending">
    <Stack gap="base" paddingBlockStart="base">
      <Section>
        <Stack gap="base">
          <Banner
            heading="Onboarding Incomplete"
            tone="warning"
          >
            <Stack gap="small">
              <Text>
                Your store is not yet fully onboarded with Snapmint. To access
                the dashboard and all features, please contact the Snapmint
                team to complete the onboarding process.
              </Text>
            </Stack>
          </Banner>

          <Box border="base" borderRadius="base" padding="base">
            <Stack gap="small">
              <Heading type="h4">Contact Snapmint Support</Heading>
              <Text>
                Reach out to the Snapmint team and they will guide you through
                the remaining steps to activate your account.
              </Text>
              <Link url="mailto:support@snapmint.com">
                support@snapmint.com
              </Link>
            </Stack>
          </Box>

          <Text>
            Once onboarding is complete, refresh this page to access your
            account.
          </Text>
        </Stack>
      </Section>
    </Stack>
  </Page>
);

function App() {
  const dispatch = useDispatch();
  const { storeDetails, loading, error } = useSelector((state) => state.shop);

  const shopify = useAppBridge();
  const shop =
    shopify?.config?.shop ||
    new URLSearchParams(window.location.search).get("shop");

  useEffect(() => {
    if (!shop) return;

    const getStoreDetails = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiService.getStoreDetail({ shop });
        if (response?.success) {
          dispatch(setStoreDetails(response.data));
        } else {
          dispatch(
            setError(response?.message || "Failed to load shop details."),
          );
        }
      } catch (err) {
        dispatch(setError(err?.message || "Something went wrong."));
      }
    };

    getStoreDetails();
  }, [shop, dispatch]);

  // Request Web Pixel scopes & register pixel when feature is enabled and not yet created
  useEffect(() => {
    if (storeDetails?.hasWebPixel === "1" && !storeDetails?.isWebPixelCreated) {
      const idleId = runAfterPaint(async () => {
        try {
          const granted = await shopify?.scopes?.request([
            "write_pixels",
            "read_customer_events",
          ]);
          if (granted !== false) {
            const res = await apiService.createWebPixel();
            if (res?.success) {
              dispatch(
                setStoreDetails({
                  ...storeDetails,
                  isWebPixelCreated: true,
                }),
              );
            }
          }
        } catch (error) {
          console.error("[WebPixel] Error:", error);
        }
      }, 1500);

      return () => cancelAfterPaint(idleId);
    }
  }, [storeDetails?.hasWebPixel, storeDetails?.isWebPixelCreated, shopify, dispatch]);

  // Block access to all routes while onboarding is not complete
  if (!loading && storeDetails?.onboardStatus === "PENDING") {
    return <OnboardingPendingScreen />;
  }

  return (
    <React.Suspense>
      <AppNavMenu />
      <AppRoutes />
    </React.Suspense>
  );
}

export default App;

