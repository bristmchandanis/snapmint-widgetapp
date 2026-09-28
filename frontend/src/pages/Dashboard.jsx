import { useSelector } from "react-redux";
import useAppThemeURL from "../hooks/useAppThemeURL";
import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  Page,
  QueryContainer,
  Section,
  Stack,
  Table,
  Text,
} from "../components/ui";

function Dashboard() {
  const shopDetails = useSelector((state) => state.shop.storeDetails);

  let plansList = [];
  if (
    shopDetails?.merchantPlan?.plans &&
    Array.isArray(shopDetails.merchantPlan.plans)
  ) {
    plansList = shopDetails.merchantPlan.plans;
  } else if (Array.isArray(shopDetails?.merchantPlan)) {
    plansList = shopDetails.merchantPlan;
  }
  const { appThemeURL, themeAppExtension } = useAppThemeURL({
    autoLoadExtension: true,
  });

  const appBlocks = [
    {
      title: "Collection Widget",
      appKey: "collection-widget",
      url: appThemeURL.appCollectionBlockUrl(),
    },
    {
      title: "Product Widget",
      appKey: "pdp-widget",
      url: appThemeURL.appPdpBlockUrl(),
    },
    {
      title: "Cart Widget",
      appKey: "cart-widget",
      url: appThemeURL.appCartBlockUrl(),
    },
  ];

  return (
    <Page heading="Dashboard" inlineSize="large">
      <Stack gap={"base"} paddingBlockStart={"base"}>
        {plansList.length > 0 ? (
          <Section>
            <Stack gap="small">
              <Heading type="h4">Merchant Plans</Heading>
              <QueryContainer>
                <Box border="base" borderRadius="base" padding="small">
                  {plansList && plansList.length > 0 ? (
                    <Table
                      columns={[
                        { title: "Plan #", key: "id" },
                        { title: "Plan Tenure", key: "tenure" },
                        { title: "Down Payment Type", key: "dp_type" },
                        { title: "Down Payment Percent", key: "dp_rate" },
                        { title: "Min Amount", key: "min_order_value" },
                        { title: "Max Amount", key: "max_order_value" },
                        { title: "Plan EMI Percent", key: "emi_amount_rate" },
                      ]}
                      rows={plansList.map((plan, idx) => ({
                        ...plan,
                        id: idx + 1, // Adding an id or unique key if needed by the table, but rows map uses rowIndex usually
                      }))}
                    />
                  ) : (
                    <Text>No plans available.</Text>
                  )}
                </Box>
              </QueryContainer>
            </Stack>
          </Section>
        ) : (
          ""
        )}
        <Section>
          <Stack gap="small">
            <Heading type="h4">Widget blocks</Heading>
            <QueryContainer>
              <Grid
                gridTemplateColumns="@container (inline-size > 800px) 1fr 1fr, 1fr"
                gap="small"
              >
                <Box border="base" borderRadius="base" padding="small">
                  <QueryContainer>
                    <Grid
                      gridTemplateColumns="@container (inline-size > 360px) 1fr auto, 1fr"
                      gap="small"
                      alignItems="center"
                      justifyItems="start"
                    >
                      <Stack
                        direction="inline"
                        gap="small"
                        alignItems="center"
                        minInlineSize="0"
                      >
                        <Heading type="h4">Theme extension</Heading>
                        {themeAppExtension?.isBlockStatus ? (
                          <Badge tone="success">Active</Badge>
                        ) : (
                          <Badge tone="error">Inactive</Badge>
                        )}
                      </Stack>
                      {!themeAppExtension?.isBlockStatus ? (
                        <Button
                          variant="primary"
                          onClick={() =>
                            window.open(appThemeURL.appEmbedUrl(), "_blank")
                          }
                        >
                          Activate
                        </Button>
                      ) : null}
                    </Grid>
                  </QueryContainer>
                </Box>
                {appBlocks.map((block) => {
                  const isActive =
                    themeAppExtension?.activations?.find(
                      (ext) => ext.handle === block.appKey,
                    )?.isBlockStatus ?? false;
                  return (
                    <Box
                      key={block.key || block.appKey}
                      border="base"
                      borderRadius="base"
                      padding="small"
                    >
                      <QueryContainer>
                        <Grid
                          gridTemplateColumns="@container (inline-size > 360px) 1fr auto, 1fr"
                          gap="small"
                          alignItems="center"
                          justifyItems="start"
                        >
                          <Stack
                            direction="inline"
                            gap="small"
                            alignItems="center"
                            minInlineSize="0"
                          >
                            <Heading type="h4">{block.title}</Heading>
                            <Badge tone={isActive ? "success" : "error"}>
                              {isActive ? "Added" : "Not added"}
                            </Badge>
                          </Stack>
                          {!isActive ? (
                            <Button
                              variant="primary"
                              onClick={() =>
                                window.open(
                                  block.url || appThemeURL.appBlockUrl(),
                                  "_blank",
                                )
                              }
                            >
                              Activate
                            </Button>
                          ) : null}
                        </Grid>
                      </QueryContainer>
                    </Box>
                  );
                })}
              </Grid>
            </QueryContainer>
          </Stack>
        </Section>
      </Stack>
    </Page>
  );
}

export default Dashboard;
